import { ProtectedResolver, Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { protectResolver } from "../../utils";

const isFollowingResolver: ProtectedResolver = async (
  { id },
  _,
  { loggedInUser }
) => {
  const user = await prisma.user.findFirst({
    where: { id, followers: { some: { id: loggedInUser.id } } },
  });
  if (user) return true;
  return false;
};

const totalPostsResolver: Resolver = ({ id }) =>
  prisma.photo.count({ where: { userId: id } });

const totalFollowingResolver: Resolver = ({ id }) =>
  prisma.user.count({ where: { followers: { some: { id } } } });

const totalFollowersResolver: Resolver = ({ id }) =>
  prisma.user.count({ where: { following: { some: { id } } } });

const seeFollowingResolver: Resolver = async (_, { userId }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (user) {
    return prisma.user.findMany({
      where: { followers: { some: { id: userId } } },
    });
  }
};

const seeFollowersResolver: Resolver = async (_, { userId }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (user) {
    return prisma.user.findMany({
      where: { following: { some: { id: userId } } },
    });
  }
};

const seeLikeUsersResolver: Resolver = (_, { photoId }) =>
  prisma.user.findMany({
    where: { likePhotos: { some: { id: photoId } } },
  });

const seeProfileResolver: Resolver = (_, { userId }) =>
  prisma.user.findUnique({
    where: { id: userId },
  });

const seeMeResolver: Resolver = (_, __, { loggedInUser }) => {
  if (loggedInUser) {
    return prisma.user.findUnique({ where: { id: loggedInUser.id } });
  }
};

const searchUsersResolver: Resolver = (_, { key }) =>
  prisma.user.findMany({ where: { username: { startsWith: key } } });

const resolvers: Resolvers = {
  User: {
    isFollowing: protectResolver(isFollowingResolver),
    totalPosts: totalPostsResolver,
    totalFollowing: totalFollowingResolver,
    totalFollowers: totalFollowersResolver,
  },
  Query: {
    seeFollowing: seeFollowingResolver,
    seeFollowers: seeFollowersResolver,
    seeLikeUsers: seeLikeUsersResolver,
    seeProfile: seeProfileResolver,
    seeMe: protectResolver(seeMeResolver),
    searchUsers: searchUsersResolver,
  },
};

export default resolvers;
