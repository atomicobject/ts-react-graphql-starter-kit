import { withContext } from "__tests__/db-helpers";
import { voteForSnackMutation } from "client/graphql-mutations/vote-for-snack-mutation";

describe("Vote mutation", () => {
  it(
    "Adds a vote for the given snack",
    withContext(async context => {
      const graphql = context.apolloClient;

      const snack = await context.repos.snacks.insert({ name: "Foo" });
      const result = await voteForSnackMutation(graphql, {
        id: snack.id,
        voteCount: 32
      });

      if (!result.data || !result.data.voteFor) throw "Unexpected Response";

      const snackResult = result.data.voteFor;
      expect(snackResult.id).toBeGreaterThan(0);
      expect(snackResult.snack.voteCount).toEqual(1);
    })
  );
});
