import { Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";

const seeCommentsResolver: Resolver = (_, { photoId, offset = 0, take = 20 }) =>
  prisma.comment.findMany({
    where: { photoId },
    include: { user: true },
    skip: offset,
    take,
    orderBy: { createdAt: "desc" },
  });

const resolvers: Resolvers = {
  Query: {
    seeComments: seeCommentsResolver,
  },
};

export default resolvers;
