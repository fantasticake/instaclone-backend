import { Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { protectResolver, uploadToAWSS3 } from "../../utils";
require("dotenv").config();

const editProfileResolver: Resolver = async (
  _,
  { email, avatar },
  { loggedInUser }
) => {
  if (loggedInUser) {
    let avatarUrl;
    if (avatar)
      avatarUrl = await uploadToAWSS3(avatar, loggedInUser.id, "avatars");
    await prisma.user.update({
      where: { id: loggedInUser.id },
      data: { email, ...(avatar && { avatar: avatarUrl }) },
    });
    return { ok: true };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    signUp: async (_, { username, email, password }) => {
      const hashed = bcrypt.hashSync(password, 10);
      await prisma.user.create({
        data: { username, email, password: hashed },
      });
      return {
        ok: true,
      };
    },
    login: async (_, { username, password }) => {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true, password: true },
      });
      if (user) {
        if (
          bcrypt.compareSync(password, user.password) &&
          process.env.SECRET_KEY
        ) {
          const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
          return { ok: true, token };
        }
        return { ok: false, error: "login failed" };
      }
      return { ok: false, error: "username not found" };
    },
    editProfile: protectResolver(editProfileResolver),
    follow: protectResolver(async (_, { userId }, { loggedInUser }) => {
      if (loggedInUser) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true },
        });
        if (user) {
          await prisma.user.update({
            where: { id: loggedInUser.id },
            data: { following: { connect: { id: userId } } },
          });
          return { ok: true };
        }
        return {
          ok: false,
          error: "user not found",
        };
      }
    }),
    unfollow: protectResolver(async (_, { userId }, { loggedInUser }) => {
      if (loggedInUser) {
        const user = await prisma.user.findFirst({
          where: { id: userId, followers: { some: { id: loggedInUser.id } } },
          select: { id: true },
        });
        if (user) {
          await prisma.user.update({
            where: { id: loggedInUser.id },
            data: { following: { disconnect: { id: userId } } },
          });
          return { ok: true };
        }
        return {
          ok: false,
          error: "user not found",
        };
      }
    }),
  },
};

export default resolvers;
