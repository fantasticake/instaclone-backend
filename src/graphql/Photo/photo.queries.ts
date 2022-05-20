import { ProtectedResolver, Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { protectResolver } from "../../utils";

const totalLikesResolver: Resolver = ({ id }) =>
  prisma.user.count({ where: { likePhotos: { some: { id } } } });

const totalCommentsResolver: Resolver = ({ id }) =>
  prisma.comment.count({ where: { photoId: id } });

const seeFeedResolver: ProtectedResolver = async (_, __, { loggedInUser }) => {
  if (loggedInUser) {
    const photos = await prisma.photo.findMany({
      where: {
        OR: [
          { userId: loggedInUser.id },
          { user: { followers: { some: { id: loggedInUser.id } } } },
        ],
      },
      include: { user: true },
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
