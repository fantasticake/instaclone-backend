import { Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { protectResolver } from "../../utils";

const createCommentResolver: Resolver = async (
  _,
  { payload, photoId },
  { loggedInUser }
) => {
  if (loggedInUser && payload) {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      select: { id: true },
    });
    if (photo) {
      await prisma.comment.create({
        data: {
          payload,
          user: { connect: { id: loggedInUser.id } },
          photo: { connect: { id: photoId } },
        },
      });
      return { ok: true };
    }
    return { ok: false, error: "Photo not found." };
  }
  return { ok: false, error: "Empty comment" };
};

const editCommentResolver: Resolver = async (
  _,
  { commentId, payload },
  { loggedInUser }
) => {
  if (loggedInUser) {
    const photo = await prisma.comment.findFirst({
      where: { id: commentId, userId: loggedInUser.id },
      select: { id: true },
    });
    if (photo) {
      await prisma.comment.update({
        where: { id: commentId },
        data: { payload },
      });
      return { ok: true };
    }
    return { ok: false, error: "Comment not found." };
  }
};

const deleteCommentResolver: Resolver = async (
  _,
  { commentId },
  { loggedInUser }
) => {
  if (loggedInUser) {
    const comment = await prisma.comment.findFirst({
      where: { id: commentId, userId: loggedInUser.id },
      select: { id: true },
    });
    if (comment) {
      await prisma.comment.delete({ where: { id: commentId } });
      return { ok: true };
    }
    return { ok: false, error: "Comment not found." };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectResolver(createCommentResolver),
    editComment: protectResolver(editCommentResolver),
    deleteComment: protectResolver(deleteCommentResolver),
  },
};

export default resolvers;
