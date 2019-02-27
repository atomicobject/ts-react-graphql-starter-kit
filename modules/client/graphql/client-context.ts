import { ApolloCache } from "apollo-cache";
export interface ClientContext {
  cache: ApolloCache<any>;
}
