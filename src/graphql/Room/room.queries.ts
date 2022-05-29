import { ProtectedResolver, Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { protectResolver } from "../../utils";

const totalUnreadResolver: Resolver = ({ id }) =>
  prisma.message.count({ where: { roomId: id, unread: true } });

const seeRoomsResolver: ProtectedResolver = (_, __, { loggedInUser }) =>
  prisma.room.findMany({
    where: { users: { some: { id: loggedInUser.id } } },
    include: { users: true },
  });

const seeRoomResolver: ProtectedResolver = (
  _,
  { roomId },
  { loggedInUser }
) => {
  const room = prisma.room.findFirst({
    where: { id: roomId, users: { some: { id: loggedInUser.id } } },
    include: { users: true },
  });
  if (room) {
    return room;
  }
  return null;
};

const resolvers: Resolvers = {
  Room: {
    totalUnread: totalUnreadResolver,
  },
  Query: {
    seeRooms: protectResolver(seeRoomsResolver),
    seeRoom: protectResolver(seeRoomResolver),
  },
};

export default resolvers;
