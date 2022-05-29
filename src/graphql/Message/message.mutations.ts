import { ProtectedResolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import pubsub from "../../pubsub";
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
      const message = await prisma.message.create({
        data: {
          payload,
          room: { connect: { id: room.id } },
          user: { connect: { id: loggedInUser.id } },
        },
        include: { user: true },
      });
      pubsub.publish("MESSAGE_CREATED", { roomUpdated: message });
      return { ok: true, id: message.id };
    }
    return { ok: false, error: "Room not found." };
  } else if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (user) {
      const message = await prisma.message.create({
        data: {
          payload,
          room: {
            create: {
              users: { connect: [{ id: loggedInUser.id }, { id: user.id }] },
            },
          },
          user: { connect: { id: loggedInUser.id } },
        },
        include: { user: true },
      });
      pubsub.publish("MESSAGE_CREATED", { roomUpdated: message });
      return { ok: true, id: message.id };
    }
    return { ok: false, error: "User not found." };
  }
  return { ok: false, error: "No target." };
};

const readMessageResolver: ProtectedResolver = async (
  _,
  { messageId },
  { loggedInUser }
) => {
  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      unread: true,
      room: { users: { some: { id: loggedInUser.id } } },
      userId: { not: loggedInUser.id },
    },
    select: { id: true },
  });
  if (message) {
    await prisma.message.update({
      where: {
        id: messageId,
      },
      data: { unread: false },
    });
    return { ok: true };
  }
  return { ok: false, error: "Message not found." };
};

const resolvers: Resolvers = {
  Mutation: {
    createMessage: protectResolver(createMessageResolver),
    readMessage: protectResolver(readMessageResolver),
  },
};

export default resolvers;
