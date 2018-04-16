import { MinimalSnack } from "graphql-api/resolvers/snack";
import sortBy from "lodash-es/sortBy";
import { Context } from "graphql-api/context";

export const QueryResolvers = {
  async allSnacks(
    query: {},
    args: {},
    context: Context
  ): Promise<MinimalSnack[]> {
    const snacks = await context.repos.snacks.all();
    return sortBy(snacks, "name");
  }
};
