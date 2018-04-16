import {
  AddSnackMutationArgs,
  VoteForMutationArgs
} from "graphql-api/schema-types";
import { MinimalSnack } from "graphql-api/resolvers/snack";
import { MinimalVote } from "graphql-api/resolvers/vote";
import { Context } from "graphql-api/context";

export const MutationResolvers = {
  async addSnack(
    obj: {},
    args: AddSnackMutationArgs,
    context: Context
  ): Promise<MinimalSnack | null> {
    try {
      return await context.repos.snacks.insert(args);
    } catch (e) {
      const dupe = await context.repos.snacks.byName.load(args.name);
      return dupe || null;
    }
  },

  async voteFor(
    obj: {},
    args: VoteForMutationArgs,
    context: Context
  ): Promise<MinimalVote> {
    const vote = await context.repos.votes.insert(args);
    return { id: vote.id, snack: { id: vote.snackId } };
  }
};
