export { SchemaMap } from "./schema-base";
import { default as resolvers } from "./resolvers";

import { rawSchema } from "./schema-base";
import { makeExecutableSchema } from "graphql-tools";

export const executableSchema = makeExecutableSchema({
  typeDefs: rawSchema,
  resolvers: resolvers as any,
});
