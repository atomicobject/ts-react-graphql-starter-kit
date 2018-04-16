import { addSnackMutation } from "client/graphql-mutations/add-snack-mutation";
import { withContext } from "__tests__/db-helpers";

describe("Add Snack", () => {
  it(
    "Inserts a new Snack",
    withContext(async context => {
      const graphql = context.apolloClient;

      const result = await addSnackMutation(graphql, {
        name: "Guacamole"
      });

      if (!result.data || !result.data.addSnack) throw "Unexpected Response";
      expect(result.data.addSnack).not.toBeFalsy();

      const snackResult = result.data.addSnack;
      expect(snackResult.id).toBeGreaterThan(0);
      expect(snackResult.name).toEqual("Guacamole");
      expect(snackResult.voteCount).toEqual(0);
    })
  );
});
