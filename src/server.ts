import { ApolloServer } from "apollo-server-express";
import * as jwt from "jsonwebtoken";
import schema from "./schema";
import prisma from "./prisma";
import express from "express";
import { graphqlUploadExpress } from "graphql-upload";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { useServer } from "graphql-ws/lib/use/ws";

require("dotenv").config();

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer(
  {
    schema,
    onConnect: async ({ connectionParams }) => {
      if (!connectionParams?.token) return false;
      if (typeof connectionParams.token == "string" && process.env.SECRET_KEY) {
        const decoded = jwt.verify(
          connectionParams.token,
          process.env.SECRET_KEY
        );
        if (typeof decoded == "object") {
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true },
          });
          if (user) return true;
        }
      }
      return false;
    },
    context: async ({ connectionParams }) => {
      if (
        connectionParams?.token &&
        typeof connectionParams.token == "string" &&
        process.env.SECRET_KEY
      ) {
        const decoded = jwt.verify(
          connectionParams.token,
          process.env.SECRET_KEY
        );
        if (typeof decoded == "object") {
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
          });
          return { loggedInUser: user };
        }
      }
    },
  },
  wsServer
);

const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  introspection: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  context: async ({ req }) => {
    if (req && typeof req.headers.token == "string" && process.env.SECRET_KEY) {
      const decoded = jwt.verify(req.headers.token, process.env.SECRET_KEY);
      if (typeof decoded == "object") {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });
        if (user) return { loggedInUser: user };
      }
    }
  },
});

server.start().then(() => {
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });

  httpServer.listen({ port: process.env.PORT }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
  });
});
