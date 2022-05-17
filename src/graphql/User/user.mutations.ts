import { ProtectedResolver, Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { deleteToAWSS3, protectResolver, uploadToAWSS3 } from "../../utils";
require("dotenv").config();

const signUpResolver: Resolver = async (_, { username, email, password }) => {
  const hashed = bcrypt.hashSync(password, 10);
  await prisma.user.create({
    data: { username, email, password: hashed },
  });
  return {
    ok: true,
  };
};

const loginResolver: Resolver = async (
  _,
  { username, password }: { username: string; password: string }
) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, password: true },
  });
  if (user) {
    if (bcrypt.compareSync(password, user.password) && process.env.SECRET_KEY) {
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
      return { ok: true, token };
    }
    return { ok: false, error: "login failed" };
  }
  return { ok: false, error: "username not found" };
};

const editProfileResolver: ProtectedResolver = async (
  _,
  { email, avatar },
  { loggedInUser }
) => {
  let avatarUrl;
  if (avatar) {
    const user = await prisma.user.findUnique({
      where: { id: loggedInUser.id },
      select: { avatar: true },
    });
    if (user && user.avatar) deleteToAWSS3(user.avatar);
    avatarUrl = await uploadToAWSS3(avatar, loggedInUser.id, "avatars");
  }
  await prisma.user.update({
    where: { id: loggedInUser.id },
    data: { email, ...(avatar && { avatar: avatarUrl }) },
  });
  return { ok: true };
};

const followResolver: ProtectedResolver = async (
  _,
  { userId },
  { loggedInUser }
) => {
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
};

const unfollowResolver: ProtectedResolver = async (
  _,
  { userId },
  { loggedInUser }
) => {
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
};

const resolvers: Resolvers = {
  Mutation: {
    signUp: signUpResolver,
    login: loginResolver,
    editProfile: protectResolver(editProfileResolver),
    follow: protectResolver(followResolver),
    unfollow: protectResolver(unfollowResolver),
  },
};

export default resolvers;
