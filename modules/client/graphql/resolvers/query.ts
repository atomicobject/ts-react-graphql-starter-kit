import { QueryResolvers } from "../client-types.gen";
import { ApolloCache } from "apollo-cache";
import * as DateIso from "core/date-iso";

const localDate: QueryResolvers.LocalDateResolver<
  DateIso.Type
> = async function(parent, args, context, info) {
  return DateIso.toIsoDate(new Date());
};

export default {
  localDate,
};
