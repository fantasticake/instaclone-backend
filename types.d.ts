import { User } from "@prisma/client";
import { FileUpload } from "graphql-upload";

interface Context {
  loggedInUser?: User;
}

export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export type ProtectResolver = (resolver: Resolver) => Resolver;

export type UploadToAWSS3 = (
  file: FileUpload,
  userId: number,
  directory: string
) => Promise<string>;

export type Resolvers = {
  [key: string]: {
    [key: string]: Resolver;
  };
};
