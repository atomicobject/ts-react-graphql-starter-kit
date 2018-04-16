import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { BatchHttpLink } from "apollo-link-batch-http";

export const graphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new BatchHttpLink({
    uri: "/graphql",
    batchInterval: 10,
    credentials: "same-origin"
  })
});
