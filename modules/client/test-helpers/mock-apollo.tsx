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
import { GraphQLResolveInfo } from "graphql";

type MockDefinitions<T> = {
  [K in keyof T]?: ((
    obj: any,
    args: any,
    context: any,
    info: GraphQLResolveInfo
  ) => (T[K] | MockList | MockDefinitions<T[K]>))
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
