import { QueryResolvers } from "graphql-api/server-types.gen";
import { MinimalUser } from "./user";

const loggedInUser: QueryResolvers.LoggedInUserResolver<
  Promise<MinimalUser>
> = async (parent, args, context, info) => {
  return await context.getCurrentUser();
};

export default {
  loggedInUser,
};
