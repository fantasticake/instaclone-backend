import { ProtectedResolver, Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { protectResolver } from "../../utils";

const totalUnreadResolver: Resolver = ({ id }) =>
  prisma.message.count({ where: { roomId: id, unread: true } });

const seeRoomsResolver: ProtectedResolver = (_, __, { loggedInUser }) =>
  prisma.room.findMany({ where: { users: { some: { id: loggedInUser.id } } } });

const resolvers: Resolvers = {
  Room: {
    totalUnread: totalUnreadResolver,
  },
  Query: {
    seeRooms: protectResolver(seeRoomsResolver),
  },
};

export default resolvers;
