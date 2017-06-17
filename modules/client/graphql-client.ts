import { ApolloClient, createBatchingNetworkInterface } from "react-apollo";

const networkInterface = createBatchingNetworkInterface({
  uri: "/graphql",
  batchInterval: 10,
  opts: {
    credentials: "same-origin"
  }
});

export const graphqlClient = new ApolloClient({
  networkInterface: networkInterface
});
