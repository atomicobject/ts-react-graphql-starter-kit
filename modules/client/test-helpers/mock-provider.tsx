import { MuiThemeProvider } from "@material-ui/core";
import { RenderFunction } from "@storybook/react";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { SchemaLink } from "apollo-link-schema";
import { GraphQLResolveInfo, ResponsePath } from "graphql";
import { SchemaMap } from "graphql-api";
import { rawSchema } from "graphql-api/schema-base";
import {
  addMockFunctionsToSchema,
  makeExecutableSchema,
  mergeSchemas,
  MockList,
  IMockFn,
} from "graphql-tools";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { MemoryRouter, MemoryRouterProps } from "react-router";
import { PlacementTheme } from "../styles/mui-theme";
import { TranslationProvider, ENGLISH } from "client/translations";
import { ThemeProvider } from "@material-ui/styles";
import * as uuid from "uuid";
import { SectionProvider } from "client/components/section-provider";
import { Section } from "client/core";
import { mapValues as _mapValues } from "lodash-es";

export { MockList } from "graphql-tools";
import * as DateIso from "core/date-iso";
import * as TimeIso from "core/time-iso";

type DeepPartial<T> = {
  [P in keyof T]?: ThingOrLambdaToThing<MockDefinitions<T[P]>>
};

type ArrayOfPartial<T extends object[]> = MockDefinitions<T[number]>[];

type ArrayOrObj<X> = X extends object[]
  ? ThingOrLambdaToThing<ArrayOfPartial<X>>
  : ThingOrLambdaToThing<DeepPartial<X>>;

type MockDefinitions<T> = { [K in keyof T]?: ArrayOrObj<T[K]> | MockList };

type ThingOrLambdaToThing<X> =
  | X
  | ((root: any, args: any, context: any, info: GraphQLResolveInfo) => X);

/** Generate a mock apollo client with a defined set of mocks. If you need to mock a new composite graphql type, update the SchemaMap in the graphql module. */
export function mockClient(
  mocks: MockDefinitions<SchemaMap>
): ApolloClient<NormalizedCacheObject> {
  const serverSchema = makeExecutableSchema({ typeDefs: rawSchema });
  addMockFunctionsToSchema({
    schema: serverSchema,
    mocks: mocks as any,
  });

  const clientSchema = makeExecutableSchema({
    typeDefs: require("client/graphql/schema.graphql"),
  });
  addMockFunctionsToSchema({
    schema: clientSchema,
    mocks: mocks as any,
  });

  const exSchema = mergeSchemas({
    schemas: [serverSchema, clientSchema],
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new SchemaLink({
      schema: exSchema,
    }),
    defaultOptions: {
      watchQuery: {
        // this governs the default fetch policy for react-apollo-hooks' useQuery():
        fetchPolicy: "cache-and-network",
      },
    },
  });
  return client;
}

export interface MockProviderOpts {
  initialUrl?: string;
  /** Definition of graphql mocks for mock client */
  mocks?: MockDefinitions<SchemaMap>;
  memoryRouterProps?: MemoryRouterProps;
  /** Console.warn about missing fields in your mocks */
  logMissingMocks?: boolean;
}

/*
  If you leave some fields out of your mocks, graphql-tools
  will mock them for you with some simple defaults.
  There's not currently a good way to disable it:
  https://github.com/apollographql/graphql-tools/issues/618

  So, for now, if you'd like to know when you missed something,
  supply logMissingMocks:true.

  The mechanism we're using for this logging is to override the
  default mocks. I haven't found a good way to call into the
  underyling default mocks, so I've pasted "defaultMockMap"
  from the graphql-tools source. Sorry.

  https://github.com/apollographql/graphql-tools/blob/5c5418cec88f1d5520eccc1d2e6dfaa511547e4d/src/mock.ts#L85
*/

const defaultMockMap: Map<string, IMockFn> = new Map();
defaultMockMap.set("Int", () => Math.round(Math.random() * 200) - 100);
defaultMockMap.set("Float", () => Math.random() * 200 - 100);
defaultMockMap.set("String", () => "Hello World");
defaultMockMap.set("Boolean", () => Math.random() > 0.5);
defaultMockMap.set("ID", () => uuid.v4());

type PrimitiveMockTypes = {
  Boolean: boolean;
  Int: number;
  Float: number;
  String: string;
  ID: string;
};

type CustomMockTypes = {
  IsoDate: DateIso.Type;
  IsoTime: TimeIso.Type;
};

const defaultPrimitiveMocks: MockDefinitions<PrimitiveMockTypes> = {
  Boolean: (root: any, args: any, context: any, info: GraphQLResolveInfo) =>
    (defaultMockMap.get("Boolean") as any)(),
  Int: (root: any, args: any, context: any, info: GraphQLResolveInfo) =>
    (defaultMockMap.get("Int") as any)(),
  Float: (root: any, args: any, context: any, info: GraphQLResolveInfo) =>
    (defaultMockMap.get("Float") as any)(),
  String: (root: any, args: any, context: any, info: GraphQLResolveInfo) =>
    (defaultMockMap.get("String") as any)(),
  ID: (root: any, args: any, context: any, info: GraphQLResolveInfo) =>
    (defaultMockMap.get("ID") as any)(),
};

const mocksForCustomTypes: MockDefinitions<CustomMockTypes> = {
  IsoDate: (root: any, args: any, context: any, info: GraphQLResolveInfo) =>
    DateIso.toIsoDate(new Date()),
  IsoTime: (root: any, args: any, context: any, info: GraphQLResolveInfo) =>
    TimeIso.fromDate(new Date()),
};

// more-specifically typed wrapper for lodash's mapValues:
function mapValues<TIn, TOut>(
  obj: TIn,
  fn: (t: TIn) => TOut
): { [K in keyof TIn]: TOut } {
  return _mapValues(obj as any, fn) as any;
}

const allMocks = { ...defaultPrimitiveMocks, ...mocksForCustomTypes };

function readPath(path: ResponsePath): React.Key[] {
  if (path.prev == undefined) {
    return [];
  } else {
    return [path.key].concat(readPath(path.prev));
  }
}

const loggingMocks = mapValues(allMocks, fn => {
  return (root: any, args: any, context: any, info: GraphQLResolveInfo) => {
    const ret = (fn as any)(root, args, context, info);
    const path = readPath(info.path)
      .reverse()
      .join(".");
    console.warn(
      `Missing mock on operation "${info.operation.name!.value}".\n` +
        `${info.parentType}.${info.fieldName} (${
          info.returnType
        }) at path "${path}"\n` +
        `defaulted to value "${ret}".`
    );
    return ret;
  };
});

/** Create a fully initialized ApolloProvider with a mocked out graphql connection and arbitrary initial state. */
export function mockProvider(opts?: MockProviderOpts) {
  if (!opts) opts = {};
  const defaultMocks = opts.logMissingMocks
    ? loggingMocks
    : mocksForCustomTypes;

  let maybeMocks = opts.mocks || {};
  let mocks = { ...defaultMocks, ...maybeMocks };

  const apollo = mockClient(mocks);

  let maybeJest: typeof jest | undefined = undefined;
  try {
    maybeJest = jest;
  } catch {}

  const initialUrl = opts.initialUrl || "/";

  return class extends React.Component<{}, {}> {
    static apolloClient = apollo;
    static displayName = "MockProvider";

    render() {
      return (
        <MuiThemeProvider theme={PlacementTheme}>
          <TranslationProvider value={ENGLISH}>
            <ThemeProvider theme={PlacementTheme}>
              <MemoryRouter initialEntries={[initialUrl]} initialIndex={0}>
                <SectionProvider
                  value={{
                    selected: null as Section,
                    setSelected: () => {},
                  }}
                >
                  <ApolloProvider client={apollo}>
                    <ApolloHooksProvider client={apollo}>
                      {this.props.children}
                    </ApolloHooksProvider>
                  </ApolloProvider>
                </SectionProvider>
              </MemoryRouter>
            </ThemeProvider>
          </TranslationProvider>
        </MuiThemeProvider>
      );
    }
  };
}

export function mockProviderDecorator(opts?: MockProviderOpts) {
  const Provider = mockProvider(opts);
  return (story: RenderFunction) => <Provider>{story()}</Provider>;
}
