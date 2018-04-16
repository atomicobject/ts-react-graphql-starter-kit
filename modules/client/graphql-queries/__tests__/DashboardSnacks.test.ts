import { withContext } from "__tests__/db-helpers";
import { DashboardSnacksQuery } from "client/graphql-types";

describe("Dashboard snack query", () => {
  it(
    "Returns snacks with name and vote count",
    withContext(async context => {
      const graphql = context.apolloClient;

      const snack = await context.repos.snacks.insert({ name: "Foo" });
      await Promise.all([
        context.repos.votes.insert({ snackId: snack.id }),
        context.repos.votes.insert({ snackId: snack.id })
      ]);

      const result = await graphql.query<DashboardSnacksQuery>({
        query: require("../DashboardSnacks.graphql")
      });

      if (!result.data || !result.data.allSnacks) throw "no snacks came back!";

      expect(result.data.allSnacks.length).toEqual(1);

      const snackResult = result.data.allSnacks[0];
      expect(snackResult.id).toEqual(snack.id);
      expect(snackResult.name).toEqual("Foo");
      expect(snackResult.voteCount).toEqual(2);
    })
  );
});
