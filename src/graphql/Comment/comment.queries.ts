import { Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";

const seeCommentsResolver: Resolver = (_, { photoId }) =>
  prisma.comment.findMany({ where: { photoId }, include: { user: true } });

const resolvers: Resolvers = {
  Query: {
    seeComments: seeCommentsResolver,
  },
};

export default resolvers;
