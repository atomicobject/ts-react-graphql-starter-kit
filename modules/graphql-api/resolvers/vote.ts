import { Vote } from "graphql-api/schema-types";
import { MinimalSnack } from "graphql-api/resolvers/snack";
import { Context } from "graphql-api/context";

export interface MinimalVote {
  id: Vote["id"];
  snack?: MinimalSnack;
}

export const VoteResolvers = {
  async snack(
    minimalVote: MinimalVote,
    args: {},
    context: Context
  ): Promise<MinimalSnack> {
    if (minimalVote.snack) {
      return minimalVote.snack;
    } else {
      const vote = await context.repos.votes.findById.load(minimalVote.id);
      return await context.repos.snacks.forVote.load(vote!.snackId);
    }
  }
};
