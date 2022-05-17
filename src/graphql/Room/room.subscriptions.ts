import { withFilter } from "graphql-subscriptions";
import prisma from "../../prisma";
import pubsub from "../../pubsub";

const resolvers = {
  Subscription: {
    roomUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["MESSAGE_CREATED"]),
        async (payload, { roomId }, context) => {
          if (context?.loggedInUser) {
            if (payload.roomUpdated.roomId != roomId) return false;
            if (payload.roomUpdated.userId == context.loggedInUser.id)
              return false;
            const room = await prisma.room.findFirst({
              where: {
                id: roomId,
                users: { some: { id: context.loggedInUser.id } },
              },
              select: { id: true },
            });
            if (room) return true;
          }
          return false;
        }
      ),
    },
  },
};

export default resolvers;
