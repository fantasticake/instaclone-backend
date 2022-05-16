import { Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { protectResolver } from "../../utils";

const resolvers: Resolvers = {
  Photo: {
    totalLikes: ({ id }) =>
      prisma.user.count({ where: { likePhotos: { some: { id } } } }),
    totalComments: ({ id }) => prisma.comment.count({ where: { photoId: id } }),
  },
  Query: {
    seeFeed: protectResolver(async (_, __, { loggedInUser }) => {
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
    }),
    photoDetail: (_, { photoId }) =>
      prisma.photo.findUnique({
        where: { id: photoId },
        include: { user: true },
      }),

    seePhotos: (_, { userId }) =>
      prisma.photo.findMany({ where: { userId }, include: { user: true } }),
  },
};

export default resolvers;
