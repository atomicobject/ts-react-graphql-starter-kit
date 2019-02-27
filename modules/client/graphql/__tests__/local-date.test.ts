import { withContext } from "__tests__/db-helpers";
import { LocalDate } from "../types.gen";
import * as DateIso from "core/date-iso";
import { dateIso } from "core/date-iso";

describe("LocalDate", () => {
  it(
    "gets the local date when run LocalDate query",
    withContext({
      initialState: { localDate: dateIso`1970-01-01` },

      async run(ctx) {
        let queryResult = await ctx.apolloClient.query<LocalDate.Query>({
          query: LocalDate.Document,
          fetchPolicy: "no-cache",
        });

        const todayDate = DateIso.toIsoDate(new Date());

        expect(queryResult.data!.localDate).toBe(todayDate);
      },
    })
  );
});
