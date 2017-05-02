import { ApolloClient, createBatchingNetworkInterface } from 'react-apollo';

const networkInterface = createBatchingNetworkInterface({
  uri: '/graphql',
  batchInterval: 10
});

export const graphqlClient = new ApolloClient({
  networkInterface: networkInterface
});