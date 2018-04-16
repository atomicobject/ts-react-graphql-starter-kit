import { QueryResolvers } from "./query";
import { SnackResolvers } from "graphql-api/resolvers/snack";
import { MutationResolvers } from "graphql-api/resolvers/mutation";
import { VoteResolvers } from "graphql-api/resolvers/vote";

export default {
  Mutation: MutationResolvers,
  Query: QueryResolvers,
  Snack: SnackResolvers,
  Vote: VoteResolvers
};
