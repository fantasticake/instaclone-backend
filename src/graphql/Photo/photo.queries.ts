import { ProtectedResolver, Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { protectResolver } from "../../utils";

const isLikedResolver: ProtectedResolver = async (
  { id },
  _,
  { loggedInUser }
) => {
  const photo = await prisma.photo.findFirst({
    where: { id, likeUsers: { some: { id: loggedInUser.id } } },
  });
  if (photo) return true;
  return false;
};

const totalLikesResolver: Resolver = ({ id }) =>
  prisma.user.count({ where: { likePhotos: { some: { id } } } });

const totalCommentsResolver: Resolver = ({ id }) =>
  prisma.comment.count({ where: { photoId: id } });

const seeFeedResolver: ProtectedResolver = async (
  _,
  { offset = 0 },
  { loggedInUser }
) => {
  if (loggedInUser) {
    const photos = await prisma.photo.findMany({
      where: {
        OR: [
          { userId: loggedInUser.id },
          { user: { followers: { some: { id: loggedInUser.id } } } },
        ],
      },
      include: { user: true },
      skip: offset,
      take: 5,
      orderBy: { createdAt: "desc" },
    });
    return photos;
  }
};

const photoDetailResolver: Resolver = (_, { photoId }) =>
  prisma.photo.findUnique({
    where: { id: photoId },
    include: { user: true },
  });

const seePhotosByUserResolver: Resolver = (_, { userId }) =>
  prisma.photo.findMany({ where: { userId } });

const seePhotosByHashtagResolver: Resolver = (_, { hashtagId }) =>
  prisma.photo.findMany({ where: { hashtags: { some: { id: hashtagId } } } });

const resolvers: Resolvers = {
  Photo: {
    isLiked: protectResolver(isLikedResolver),
    totalLikes: totalLikesResolver,
    totalComments: totalCommentsResolver,
  },
  Query: {
    seeFeed: protectResolver(seeFeedResolver),
    photoDetail: photoDetailResolver,
    seePhotosByUser: seePhotosByUserResolver,
    seePhotosByHashtag: seePhotosByHashtagResolver,
  },
};

export default resolvers;
