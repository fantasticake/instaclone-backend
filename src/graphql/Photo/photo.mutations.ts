import { Resolver, Resolvers } from "../../../types";
import prisma from "../../prisma";
import { formatHashtags, protectResolver, uploadToAWSS3 } from "../../utils";

const editPhotoResolver: Resolver = async (
  _,
  { photoId, caption },
  { loggedInUser }
) => {
  if (loggedInUser) {
    const photo = await prisma.photo.findFirst({
      where: { id: photoId, userId: loggedInUser.id },
      select: { id: true },
    });
    if (photo) {
      const hashtagformats = formatHashtags(caption);
      await prisma.photo.update({
        where: { id: photoId },
        data: {
          caption,
          hashtags: { set: [], connectOrCreate: hashtagformats },
        },
      });
      await prisma.hashtag.deleteMany({ where: { photos: { none: {} } } });
      return { ok: true };
    }
    return { ok: false, error: "Photo not found." };
  }
};

const deletePhotoResolver: Resolver = async (
  _,
  { photoId },
  { loggedInUser }
) => {
  if (loggedInUser) {
    const photo = await prisma.photo.findFirst({
      where: { id: photoId, userId: loggedInUser.id },
      select: { id: true },
    });
    if (photo) {
      await prisma.photo.delete({ where: { id: photoId } });
      //delete awss3 file
      await prisma.hashtag.deleteMany({ where: { photos: { none: {} } } });
      return { ok: true };
    }
    return { ok: false, error: "Photo not found" };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    createPhoto: protectResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        if (loggedInUser) {
          const hashtagformats = formatHashtags(caption);
          const url = await uploadToAWSS3(file, loggedInUser.id, "photos");
          const photo = await prisma.photo.create({
            data: {
              url,
              user: { connect: { id: loggedInUser.id } },
              ...(caption && {
                caption,
                hashtags: {
                  connectOrCreate: hashtagformats,
                },
              }),
            },
          });
          return photo;
        }
      }
    ),
    editPhoto: protectResolver(editPhotoResolver),
    deletePhoto: protectResolver(deletePhotoResolver),
    likePhoto: protectResolver(async (_, { photoId }, { loggedInUser }) => {
      if (loggedInUser) {
        const photo = await prisma.photo.findFirst({
          where: {
            AND: [
              { id: photoId },
              { likeUsers: { none: { id: loggedInUser.id } } },
            ],
          },
          select: { id: true },
        });
        if (photo) {
          await prisma.user.update({
            where: { id: loggedInUser.id },
            data: { likePhotos: { connect: { id: photoId } } },
          });
          return { ok: true };
        }
        return { ok: false, error: "Photo not found." };
      }
    }),
    unlikePhoto: protectResolver(async (_, { photoId }, { loggedInUser }) => {
      if (loggedInUser) {
        const photo = await prisma.photo.findFirst({
          where: {
            AND: [
              { id: photoId },
              { likeUsers: { some: { id: loggedInUser.id } } },
            ],
          },
          select: { id: true },
        });
        if (photo) {
          await prisma.user.update({
            where: { id: loggedInUser.id },
            data: { likePhotos: { disconnect: { id: photoId } } },
          });
          return { ok: true };
        }
        return { ok: false, error: "Photo not found." };
      }
    }),
  },
};

export default resolvers;
