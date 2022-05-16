import { ApolloServer } from "apollo-server-express";
import * as jwt from "jsonwebtoken";
import schema from "./graphql/schema";
import prisma from "./prisma";
import express from "express";
import { graphqlUploadExpress } from "graphql-upload";

require("dotenv").config();

const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  context: async ({ req }) => {
    if (typeof req.headers.token == "string" && process.env.SECRET_KEY) {
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
  const app = express();
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
  app.listen({ port: process.env.PORT }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
  });
});
