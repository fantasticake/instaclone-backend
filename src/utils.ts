import {
  DeleteToAWSS3,
  ProtectedResolver,
  ProtectResolver,
  Resolver,
  UploadToAWSS3,
} from "../types";
import AWS from "aws-sdk";

export const protectResolver: ProtectResolver = (resolver) => {
  return (parent, args, context, info) => {
    if (context.loggedInUser) return resolver(parent, args, context, info);
    return info.operation.operation == "mutation"
      ? { ok: false, error: "cannot access" }
      : null;
  };
};

export const uploadToAWSS3: UploadToAWSS3 = async (file, userId, directory) => {
  const { createReadStream, filename } = await file;
  const readStream = createReadStream();
  const objectName = `${userId}${Date.now()}-${filename}`;

  const s3 = new AWS.S3({ region: "ap-northeast-2" });
  const photo = await s3
    .upload({
      Bucket: "fantasticake-instaclone-uploads",
      Key: `${directory}/${objectName}`,
      Body: readStream,
      ACL: "public-read",
    })
    .promise();

  return photo.Location;
};

export const deleteToAWSS3: DeleteToAWSS3 = async (url) => {
  const splitted = url.split("/");
  const fileName = [
    splitted[splitted.length - 2],
    splitted[splitted.length - 1],
  ].join("/");

  const s3 = new AWS.S3({ region: "ap-northeast-2" });
  await s3
    .deleteObject({
      Bucket: "fantasticake-instaclone-uploads",
      Key: fileName,
    })
    .promise();
};

export const formatHashtags = (caption: string | null) => {
  if (caption) {
    const matches = caption.match(/#\w+/g);
    const hashtags = matches?.map((hashtag: string) => ({
      where: { hashtag },
      create: { hashtag },
    }));
    return hashtags;
  }
};
