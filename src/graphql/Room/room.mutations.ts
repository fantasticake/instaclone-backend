import { ProtectedResolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { protectResolver } from "../../utils";

const createRoomResolver: ProtectedResolver = async (
  _,
  { userId },
  { loggedInUser }
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (user) {
    const room = await prisma.room.findFirst({
      where: {
        AND: [
          { users: { some: { id: userId } } },
          { users: { some: { id: loggedInUser.id } } },
        ],
      },
      select: { id: true },
    });
    if (room) return { ok: false, id: room.id, error: "Room exists." };

    const newRoom = await prisma.room.create({
      data: { users: { connect: [{ id: userId }, { id: loggedInUser.id }] } },
      select: { id: true },
    });
    return { ok: true, id: newRoom.id };
  }
  return { ok: false, error: "User not found." };
};

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
    createRoom: protectResolver(createRoomResolver),
    exitRoom: protectResolver(exitRoomResolver),
  },
};

export default resolvers;
