import * as Blueprint from "blueprints";
import { GetLoggedInUser } from "client/graphql/types.gen";
import { withContext } from "__tests__/db-helpers";

describe("Query", () => {
  describe("logged in user", () => {
    it(
      "returns user logged in context",
      withContext({
        userScenario: universe => universe.insert(Blueprint.user),
        async run(ctx, { user }) {
          let result = await ctx.apolloClient.query<GetLoggedInUser.Query>({
            query: GetLoggedInUser.Document,
          });
          expect(result.data.loggedInUser.id).toEqual(user!.id);
        },
      })
    );
  });
});
