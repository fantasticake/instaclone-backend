import { ProtectedResolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { protectResolver } from "../../utils";

const exitRoomResolver: ProtectedResolver = async (
  _,
  { roomId },
  { loggedInUser }
) => {
  const room = await prisma.room.findFirst({
    where: { id: roomId, users: { some: { id: loggedInUser.id } } },
    select: { id: true },
  });
  if (room) {
    const totalUsers = await prisma.user.count({
      where: { rooms: { some: { id: roomId } } },
    });
    if (totalUsers == 1) {
      await prisma.message.deleteMany({ where: { roomId } });
      await prisma.room.delete({
        where: { id: roomId },
      });
    } else {
      await prisma.room.update({
        where: { id: roomId },
        data: { users: { disconnect: { id: loggedInUser.id } } },
      });
    }
    return { ok: true };
  }
  return { ok: false, error: "Room not found." };
};

const resolvers: Resolvers = {
  Mutation: {
    exitRoom: protectResolver(exitRoomResolver),
  },
};

export default resolvers;
