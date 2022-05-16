import { Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { protectResolver } from "../../utils";

const seeMeResolver: Resolver = (_, __, { loggedInUser }) => {
  if (loggedInUser) {
    return prisma.user.findUnique({ where: { id: loggedInUser.id } });
  }
};

const searchUsersResolver: Resolver = (_, { key }) =>
  prisma.user.findMany({ where: { username: { startsWith: key } } });

const resolvers: Resolvers = {
  User: {
    totalFollowing: ({ id }) =>
      prisma.user.count({ where: { followers: { some: { id } } } }),
    totalFollowers: ({ id }) =>
      prisma.user.count({ where: { following: { some: { id } } } }),
  },
  Query: {
    seeFollowing: async (_, { userId }) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (user) {
        return prisma.user.findMany({
          where: { followers: { some: { id: userId } } },
        });
      }
    },
    seeFollowers: async (_, { userId }) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (user) {
        return prisma.user.findMany({
          where: { following: { some: { id: userId } } },
        });
      }
    },
    seeLikeUsers: (_, { photoId }) =>
      prisma.user.findMany({
        where: { likePhotos: { some: { id: photoId } } },
      }),
    seeProfile: (_, { userId }) =>
      prisma.user.findUnique({
        where: { id: userId },
      }),
    seeMe: protectResolver(seeMeResolver),
    searchUsers: searchUsersResolver,
  },
};

export default resolvers;
