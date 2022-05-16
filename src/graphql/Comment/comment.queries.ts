import { Resolvers } from "../../../types";
import prisma from "../../prisma";

const resolvers: Resolvers = {
  Query: {
    seeComments: async (_, { photoId }) => {
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
    },
  },
};

export default resolvers;
