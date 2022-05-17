import { ProtectedResolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { protectResolver } from "../../utils";

const createMessageResolver: ProtectedResolver = async (
  _,
  { roomId, userId, payload },
  { loggedInUser }
) => {
  if (roomId) {
    const room = await prisma.room.findFirst({
      where: { id: roomId, users: { some: { id: loggedInUser.id } } },
      select: { id: true },
    });
    if (room) {
      await prisma.message.create({
        data: {
          payload,
          room: { connect: { id: room.id } },
          user: { connect: { id: loggedInUser.id } },
        },
      });
      return { ok: true };
    }
    return { ok: false, error: "Room not found." };
  } else if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (user) {
      await prisma.message.create({
        data: {
          payload,
          room: {
            create: {
              users: { connect: [{ id: loggedInUser.id }, { id: user.id }] },
            },
          },
          user: { connect: { id: loggedInUser.id } },
        },
      });
      return { ok: true };
    }
    return { ok: false, error: "User not found." };
  }
  return { ok: false, error: "No target." };
};

const resolvers: Resolvers = {
  Mutation: {
    createMessage: protectResolver(createMessageResolver),
  },
};

export default resolvers;
