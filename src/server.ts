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
import morgan from "morgan";

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
    onConnect: async ({ connectionParams }: any) => {
      if (!connectionParams?.token) return false;
      if (process.env.SECRET_KEY) {
        const token = connectionParams.token?._W || connectionParams.token;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
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
    context: async ({ connectionParams }: any) => {
      if (connectionParams?.token && process.env.SECRET_KEY) {
        const token = connectionParams.token?._W || connectionParams.token;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
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
    try {
      if (
        req &&
        typeof req.headers.token == "string" &&
        process.env.SECRET_KEY
      ) {
        const decoded = jwt.verify(req.headers.token, process.env.SECRET_KEY);
        if (typeof decoded == "object") {
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
          });
          if (user) return { loggedInUser: user };
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
});

server.start().then(() => {
  app.use(morgan("dev"));
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });

  httpServer.listen({ port: process.env.PORT }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
  });
});
