import { withContext } from "__tests__/db-helpers";
import { GetLocalName, ChangeLocalName } from "../types.gen";

describe("GetLocalName and ChangeLocalName", () => {
  it(
    "updates the local name when we run the ChangeLocalName mutation",
    withContext({
      initialState: { localName: "foo" },

      async run(ctx) {
        let queryResult = await ctx.apolloClient.query<GetLocalName.Query>({
          query: GetLocalName.Document,
        });

        expect(queryResult.data!.client).toEqual("foo");

        const mutationResult = await ctx.apolloClient.mutate<
          ChangeLocalName.Mutation,
          ChangeLocalName.Variables
        >({
          mutation: ChangeLocalName.Document,
        });

        expect(mutationResult.data!.setLocalName).toEqual("Foo");

        queryResult = await ctx.apolloClient.query<GetLocalName.Query>({
          query: GetLocalName.Document,
        });

        expect(queryResult.data!.client).toEqual("Foo");
      },
    })
  );
});
