import * as SchemaTypes from "./schema-types";

export const rawSchema = require("./schema.graphql");

/** Shape of high level schema types. Used to type check mock apollo client arguments */
export interface SchemaMap {
  Query: SchemaTypes.Query;
  // TODO: Add new types with resolvers you want to mock here
  // Document: SchemaTypes.Document;
}
