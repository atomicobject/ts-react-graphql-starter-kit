export { SchemaMap } from "./schema-base";
export { buildContext, Context } from "./context";
import { default as resolvers } from "./resolvers";

import { rawSchema } from "./schema-base";
import { makeExecutableSchema } from "graphql-tools";

export const executableSchema = makeExecutableSchema({
  typeDefs: rawSchema,
  resolvers
});
