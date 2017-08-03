import { Context } from "../context";
import { Query, UserByIdQueryArgs } from "../schema-types";

import shuffle from "lodash-es/shuffle";

export const QueryResolvers = {
  async allUsers(
    obj: {},
    args: {},
    context: Context
  ): Promise<Query["allUsers"]> {
    return await context.users.all();
  },

  async userById(
    obj: {},
    args: UserByIdQueryArgs,
    context: Context
  ): Promise<Query["userById"]> {
    const user = await context.users.findById.load(args.id);
    return user || null;
  },

  async game(): Promise<Query["game"]> {
    return { answer: shuffle([1, 2, 3]) };
  }
};
