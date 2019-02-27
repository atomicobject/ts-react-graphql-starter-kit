## Setup

- Install Node 10 LTS and yarn. Older or newer versions may or may not work. (Recommend `nvm` and `brew install yarn --without-node` on mac.)
- Install Docker.app. Our database and other services are configured to run in docker.
- Symlink `.env.example` to `.env`, which sets up your environment to run from Docker. You can copy and modify `.env.example` to `.env` if the defaults won't work for you.
- Start postgres with: `docker-compose up`. This will set up a postgres docker image and start it.
- Run `yarn` to install dependencies.
- Run `yarn db:create` to create development and test databases.
- Run `yarn build` to build the application, including supporting scripts.

Note: Start `docker-compose up` and leave it running any time you want to run the app/tests.

## Running the app

This repository includes a simple redux/graphql-based app. If you'd like to play around with this example, here's how to start it up:

- Run `yarn build` to, among other things, create generated types and scripts.
- Run `yarn db:migrate:latest` to migrate your development and test databases.
- Optionally run `yarn db:migrate-and-seed` to add some test data to your dev database.
- Run `yarn dev` to start the hot-reloading dev server, which can be visited on port 3000.
- See the interactive style guide and component tests by running `yarn dev:storybook` and visit `localhost:9001`.
- To run unit tests, run `yarn test:unit` or `yarn test:unit --watch` for the interactive jest-based test runner.

For this project, we have decided not to check in the generated GraphQL types. This means that
you'll need to run `yarn build` before you begin viewing or editing the source code, lest you see
spurious type errors and failed imports.

## Stack

This project is a single-page webapp using the following technologies:

- [TypeScript](https://www.typescriptlang.org)  – a type-safe variant of JavaScript from Microsoft which reduces errors and improves IDE/editor support over regular JavaScript.
- Node.js – powers our server, and is pinned to the latest LTS release.
- [Express](https://expressjs.com) – our HTTP server, which is lightly used only to host our GraphQL API.
- [GraphQL](http://graphql.org) – an alternative to REST apis which supports a demand-driven architecture. Our GraphQL server is [Apollo GraphQL server](http://dev.apollodata.com/tools/graphql-server/).
- [Jest](http://facebook.github.io/jest/#use) for unit testing.
- [Webpack](https://webpack.github.io) – builds our application for our various deployment targets.
- [Apollo Link State](https://www.apollographql.com/docs/link/links/state.html) for client state management.
- [Nightmare.js](http://nightmarejs.org) for acceptance testing.
- [React Storybook](https://storybook.js.org/) for component documentation and style guides.
- [JSVerify](http://jsverify.github.io) for property-based testing.

## Code Organization

This repository is structured to encourage a view of the whole repository as one application. The client and server are “just” different entry points, and we use webpack to elide libraries and code that are irrelevant to a particular entry point.

There are a few key directories:

- `entry` – contains the primary entry points of the application. If you want to see what happens when you start up the client or server, start there. These are also the entry points for webpack.
- `webpack` contains a webpack configuration for each entry point, as well as `webpack-dev-server.js` which sets up the dev server used during development.
- `modules` contains all of the code. Each module is a self-contained concept that may be used by other modules, command-line scripts, etc.
- `config` contains configuration files for our various environments. The default config is set up as a twelve-factor app to be hosted in heroku. Most variables can be controlled via the environment – see `config/default.js`.
- `dist` is where webpack stores compiled slices of the app.

Default modules:

- `client` – React/redux front-end.
- `db` – core knex database connection helpers
- `records` – database record types and repositories, with base record and repository classes in `record`. Depends on `db`
- `graphql` – Graphql schema and implementation. Depends on `records` and `db`
- `server` – express.js server that serves the client and graphql api. Depends on `graphql`
- `helpers` – generic helpers that can be used in any other module – no dependencies

## Environment Variables

This app is set up as a 12-factor app, configurable via environment variables.

The supported environment variables are:

- `NODE_ENV` – `test`, `development`, or `production`
- `DATABASE_URL` – the url of the postgres database.
- `PORT` – port for the server to bind to. Defaults to `3001`
- `PUBLIC_HOST` – the public facing domain name to include in e.g. links.
- `REQUIRE_SSL` – if this is not `false`, all requests are redirected to HTTPS.
- `WEB_CONCURRENCY` – # of workers to use in clustered mode. Clustering disabled if value is 1.
- `NODE_MAX_OLD_SIZE` - limit node process size to a given amount. Defaults to `460` MB to work well in 512MB containers, such as heroku.
- `DEV_SERVER_DISABLE_HOST_CHECK` - disables the host check in webpack dev server, to allow testing from a VM or other host.

## Running locally

Run `yarn dev` to start up both the server and client at the same time.

`yarn dev` runs:

- webpack in watch mode to hot recompile the server
- nodemon to run the server on port `3001` and restart the server on recompilation.
- webpack-dev-server to run the client on port `3000`, with proxy through to the server
- nodemon processes to regenerate typescript types corresponding to graphql files on change.

The dev server watches for changes and restarts `express` each time a dependency file changes.

The dev client is using the `webpack-dev-server` to hot reload the client whenever a file changes. Our webpack dev server is configured in `webpack/webpack-dev-server.js`.

To build for production, run:

```
NODE_ENV=production yarn build
```

This will build the entire app into `./dist/`.

## Tests

We are using Jest for unit testing, and colocating tests with the modules they’re testing.

Unit tests for a module are located in a `__tests__` directory in the same directory as the file being tested. Tests for `module.ts` should be named `module.test.ts`. Index files should be named after their parent directory. `some-module/index.ts` should be tested in `some-module/__tests__/module.test.ts`.

### Running Unit Tests

To run unit tests, run `yarn jest`. This simply runs jest in the current directory, which will use config in the `jest` section of `package.json`.

To run jest in watch mode, and have it automatically rerun tests when files change:

```
yarn jest --watch
```

To see other jest options, you can run:

```
yarn jest -- --help
```

`yarn test:unit` is an alias for running `jest` directly.

### Component tests

We are testing react components with [Enzyme](https://github.com/airbnb/enzyme) . See that for more information.

These tests are included in the Jest (unit) tests (above.)

### Acceptance tests

Acceptance tests are written using [Nightmare](http://codecept.io). See the `test:acceptence` tasks for more.

### Linting

We are using `tslint` for linting. It is run automatically before unit tests.

### Property testing

We have experimentally included [JSVerify](http://jsverify.github.io) for property-based testing. Property-based testing is based on generating arbitrary inputs for functions and asserting that properties are invariant across those inputs. If an input is found which violates the property, the library will automatically simplify it to the minimal case that reproduces the error.

## Styleguide

We are using [React Storybook](https://storybook.js.org/) to generate a styleguide for our react components.

You can run the style guide with `yarn dev:storybook`

## GraphQL and Code Generation

We're generating type definitions from our graphql schema, queries, and mutations. This allows us to get static type safety between our graphql code and typescript implementations.

To enable this, we're storing all graphql code in individual `.graphql` files. Our build process and dev server look for these and use them to generate the appropriate type definitions.

## User Authentication with SAML

https://docs.google.com/document/d/1NySKusNwZzChAxY5vnnXnfl9l4JmaGhT3hzyacviuZg/edit

### Server

The file `modules/graphql/schema-types.ts` is generated by `graphql-code-generator` from `schema.graphql` and any other `.graphql` file in the `graphql` module.

`schema-types` exports interfaces for all graphql `type`s in the schema, including e.g. `Query`.

For example, if we have the following schema:

```graphql
type User {
  id: Int!
  name: String!
  email: String!
}

type Query {
  usersById(id: Int!): [User]!
}
```

`schema-types.ts` will contain definitions for:

- `Query` – containing the return types for each query
- `UsersByIdQueryArgs` – the expected arguments for the `usersById` query
- `User` – the straightforward typescript definition for `User`.

Note that we make liberal use of `!` in the query definition to disallow `null` values as appropriate. `!` should **not** be used when the operation may fail. `Graphql` prefers `null` returns in that case in most circumstances.

To make use of these types, we import them into our `modules/graphql/index.ts` for our resolver definition.

In particular, we would define our `usersById` resolver as:

```ts
 usersById(obj: {}, args: UsersByIdQueryArgs, context: Context): Promise<Query['usersById']> {
   ...
 }
```

Note that we use `UsersByIdQueryArgs` to tell typescript that this should be consistent with the defined schema arguments. We could use an inline type or separate interface, but doing so would defeat TypeScript's ability to tell us when we change the schema that our implementation is no longer compatible.

Similarly, we define the return type to be `Promise<Query['usersById']>`. `Query['usersById']` is TypeScript syntax that means "whatever tye type of `usersById` on in the `Query` type is". By using this type subscripting syntax, we get static validation that our resolver is compatible with our schema.

### GraphQL in the client

In the client we generate types for our graphql queries and mutations.

Given a `.graphql` file containing the query:

```graphql
query Users($foo: Int!) {
  usersById(id: $foo) {
    id
    name
  }
}
```

Entries will be added to `modules/client/graphql-types.ts`:

```typescript
export interface UsersQueryVariables {
  foo: number;
}

export interface UsersQuery {
  // Returns all of the users in the system (canned results)
  usersById: Array<{
    id: number;
    name: string;
  }>;
}
```

The types and query can be used with Apollo by `require`-ing the `.grahql` file directly from typescript and passing it in where a query is expected. The `UsersQuery`

```typescript
export async function fetchUsers(id: number): Promise<UsersQuery["usersById"]> {
  const vars: UsersQueryVariables = {
    foo: id,
  };
  const result = await graphqlClient.query<UsersQuery>({
    query: require("./Answer.graphql"),
    variables: vars,
  });

  return result.data.usersById;
}
```

### Graphql building

The `build:graphql` task generates all type files. It:

1.  Generates `modules/graphql/schema.json` from the `schema.graphql`. This is used by subsequent steps.
2.  Generates `schema-types.ts` in the graphql module
3.  Generates `graphql-types.ts` in the client

The `dev:graphql` task – which is run automatically by `dev` – watches for changes to any `.graphql` file and reruns `build:graphql`

## Client Overview

The client has the following capabilities built-in:

- Apollo Client for GraphQL queries/mutations.
- Redux Saga for asynchronous workflows.
- A small lens library for state selectors/updates.

Apollo Client is a smart graphql client with automatic caching and higher-order components for wiring presentation components to graphql queries.

Redux Sagas uses ES7 generator functions to support high level declaration and coordination of asynchronous workflows.

See `modules/client/sagas/index.ts` for an example redux saga which uses the apollo client to execute graphql queries.

Accessing/updating functional state in TypeScript requires a different solution from many of the common solutions in JavaScripot – `immutable-helper`, for example, is fundamentally untypable.

This starter-kit includes a library of functional lenses which are simple read/write helpers for accessing and updating substate of another object. A lens can be used as a function to get something out of an object, or can have `.set` or `.update` called on it to create an updated copy of an object.

The lens library is defined in `modules/helpers/lenses.ts`. See the tests for examples, as well as use in `sagas/index.ts` and `reducers/index.ts`.

## CSS

CSS is implemented using the [Trello CSS Guide](https://github.com/trello/trellisheets/blob/master/styleguide.md) naming conventions.

We are using the [Bourbon stack](bourbon.io) as our CSS framework.

### Organization

Instead of one monolithic stylesheet, each component should have its own `styles.css` which it requires in it’s main module. This approach eases maintainability, as each react component has its own stylesheet, and webpack will only package up CSS for the components we actually use.

React components should be named with semantic, specific names. However, the CSS classes used for a React component should be as generic as possible.

Prefer using an existing component class name with a new `mod-` modifier to specify the behavior of your component versus adding a new css class per react component.

For example, it is better to have one `btn` class that has a different `mod-foo` modifier for the `FooButton` react component, than make a `foo-button` class.

See the Trello CSS guide for more info.

## DB

The database is postgres and is preconfigured to run in Docker.

To connect via a postgres client:

- Host: 127.0.0.1
- Port: 5432
- Username: root
- No Password

Database names:

- `development`
- `test`

- To start: `docker-compose up` and leave running
- To create dev/test databases: `yarn db:create`
- To run psql shell against development DB: `yarn db:run -- development`

## CI

The project is configured to run in CircleCI (see .circleci/config.yml). It's possible to run [locally](https://circleci.com/docs/2.0/local-cli/) with `circleci local execute`. Warning: the tests may hang after completion if there aren't enough concurrent workers. Fix this by cranking up your cores in Docker or by specifying Jest's [--maxWorkers](https://jestjs.io/docs/en/cli.html#maxworkers-num). (We'd prefer not to _check in_ a maxWorkers setting; we want test concurrency to be elastic with the number of hardware threads available.)
