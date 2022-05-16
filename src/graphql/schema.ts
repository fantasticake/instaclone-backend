import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";

const allTypeDefs = loadFilesSync(`${__dirname}/**/*.typeDefs.ts`);
const allResolvers = loadFilesSync(`${__dirname}/**/*.(queries|mutations).ts`);
const typeDefs = mergeTypeDefs(allTypeDefs);
const resolvers = mergeResolvers(allResolvers);
const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
