import { ProtectedResolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { protectResolver } from "../../utils";

const seeMessagesResolver: ProtectedResolver = (
  _,
  { roomId },
  { loggedInUser }
) =>
  prisma.message.findMany({
    where: { roomId, room: { users: { some: { id: loggedInUser.id } } } },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

const resolvers: Resolvers = {
  Query: {
    seeMessages: protectResolver(seeMessagesResolver),
  },
};

export default resolvers;
