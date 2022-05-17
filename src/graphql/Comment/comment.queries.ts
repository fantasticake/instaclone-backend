import { Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";

const seeCommentsResolver: Resolver = async (_, { photoId }) => {
  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
    select: { id: true },
  });
  if (photo) {
    return prisma.comment.findMany({
      where: { photoId },
      include: { user: true },
    });
  }
};

const resolvers: Resolvers = {
  Query: {
    seeComments: seeCommentsResolver,
  },
};

export default resolvers;
