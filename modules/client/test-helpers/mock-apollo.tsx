import * as React from "react";
import { SchemaMap, rawSchema } from "../../graphql/schema-base";
import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  MockList
} from "graphql-tools";

export { MockList } from "graphql-tools";

import { ApolloProvider, ApolloClient, getDataFromTree } from "react-apollo";

import { mockNetworkInterfaceWithSchema } from "apollo-test-utils";
type MockDefinitions<T> = {
  [K in keyof T]?: MockDefinitions<T[K]> | (() => (T[K] | MockList))
};

export type SchemaMocks = MockDefinitions<SchemaMap>;

/** Generate a mock apollo client with a defined set of mocks. If you need to mock a new composite graphql type, update the SchemaMap in the graphql module. */
export function mockClient(mocks: MockDefinitions<SchemaMap>): ApolloClient {
  const exSchema = makeExecutableSchema({ typeDefs: rawSchema });
  addMockFunctionsToSchema({
    schema: exSchema,
    mocks: mocks as any
  });

  const netInterface = mockNetworkInterfaceWithSchema({ schema: exSchema });
  const client = new ApolloClient({
    networkInterface: netInterface
  });
  return client;
}

export async function warmUpClient(props: {
  client: any;
  query: any;
  variables: any;
}) {
  // Warm up the cache
  return await props.client.query({
    query: props.query,
    variables: props.variables
  });
}