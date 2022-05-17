import { Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";

const searchHashtagsResolver: Resolver = (_, { key }) =>
  prisma.hashtag.findMany({ where: { hashtag: { startsWith: key } } });

const resolvers: Resolvers = {
  Query: {
    searchHashtags: searchHashtagsResolver,
  },
};

export default resolvers;
