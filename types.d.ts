import { User } from "@prisma/client";
import { FileUpload } from "graphql-upload";

interface Context {
  loggedInUser?: User;
}

interface ProtectedContext {
  loggedInUser: User;
}

export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export type ProtectedResolver = (
  parent: any,
  args: any,
  context: ProtectedContext,
  info: any
) => any;

export type Resolvers = {
  [key: string]: {
    [key: string]: Resolver | ProtectedResolver;
  };
};

export type ProtectResolver = (
  resolver: ProtectedResolver
) => ProtectedResolver;

export type UploadToAWSS3 = (
  file: FileUpload,
  userId: number,
  directory: string
) => Promise<string>;

export type DeleteToAWSS3 = (url: string) => void;
