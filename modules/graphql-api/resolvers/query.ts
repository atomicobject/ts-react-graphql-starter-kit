import { Context } from "graphql-api/context";

export const QueryResolvers = {
  test(self: {}, args: {}, context: Context) {
    return "Hello!";
  }
};
