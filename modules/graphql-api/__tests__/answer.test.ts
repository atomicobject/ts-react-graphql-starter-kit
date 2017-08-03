import resolvers from "../resolvers";
import * as jsv from "jsverify";
import uniqWith from "lodash-es/uniqWith";
import isEqual from "lodash-es/isEqual";
import range from "lodash-es/range";

import { buildLocalApollo } from "../context";
import gql from "graphql-tag";

describe("answer query", () => {
  it("returns 1, 2, and 3 in some order", () => {
    var prop = jsv.forall("nat", async () => {
      const game = await resolvers.Query.game()!;
      const result = game.answer;
      result.sort();
      return isEqual([1, 2, 3], result);
    });

    jsv.check(prop, { tests: 100 });
  });

  it("returns different sequences each time", async () => {
    const games = await Promise.all(range(100).map(resolvers.Query.game));
    const answers = games.map(g => g.answer);
    const uniqAnswers = uniqWith(answers, isEqual);
    expect(uniqAnswers.length).toBeGreaterThan(1);
  });

  it("can be queried with the local apollo client", async () => {
    const client = buildLocalApollo();
    const q = gql`
      query getAnswers {
        game {
          answer
        }
      }
    `;
    const result = await client.query<any>({ query: q });
    expect(result.data.game.answer.length).toEqual(3);
  });
});
