import { Query, Mutation } from "client/graphql/types.gen";

export const rawSchema = require("./schema.graphql");

/** Shape of high level schema types. Used to type check mock apollo client arguments */
export interface SchemaMap {
  Query: Query;
  Mutation: Mutation;
}
