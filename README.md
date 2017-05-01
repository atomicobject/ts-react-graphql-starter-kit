# SPA Starter Kit

This starter kit is meant as a starting point for single-page webapps using TypeScript, React, Redux, and GraphQL that we use at Atomic Object. Feel free to clone this project and use it to seed any project for which it would be helpful.

## TODO
Still to be set up/configured in this starter kit.

### Starter kit todos
- [ ] CoreJS for polyfill support
- [ ] fetch polyfill for Apollo in non-bleeding edge browser.
- [ ] DB / Docker / migrations
- [ ] Source maps
- [ ] Browser testing – nightmare?
- [ ] Node clustering
- [ ] css prefixing settings
- [ ] Reselect?
- [x] GraphQL client

### README Todos

- [x] Module organization
- [x] Running tests
- [x] TSlint
- [x] Async (redux sagas)
- [ ] Database
- [x] Selectors/state updates – lens intro
- [x] Bourbon/neat trello CSS guide
- [x] Property-based testing


## Stack
This project is a single-page webapp using the following technologies:

* [TypeScript](https://www.typescriptlang.org)  – a type-safe variant of JavaScript from Microsoft which reduces errors and improves IDE/editor support over regular JavaScript.
* Node.js – powers our server, and is pinned to the latest LTS release.
* [Express](https://expressjs.com) – our HTTP server, which is lightly used only to host our GraphQL API.
* [GraphQL](http://graphql.org) – an alternative to REST apis which supports a demand-driven architecture.  Our GraphQL server is [Apollo GraphQL server](http://dev.apollodata.com/tools/graphql-server/).
* [Jest](http://facebook.github.io/jest/#use) – for unit testing.
* [Webpack](https://webpack.github.io) – builds our application for our various deployment targets.
* [Redux](http://redux.js.org) for client state management.
* [Redux Saga](https://redux-saga.js.org) for workflows and asynchronous processes.
* [JSVerify](http://jsverify.github.io) for property-based testing.

## Code Organization
This repository is structured to encourage a view of the whole repository as one application. The client and server are “just” different entry points, and we use webpack to elide libraries and code that are irrelevant to a particular entry point.

There are a few key directories:
* `entry` – contains the primary entry points of the application. If you want to see what happens when you start up the client or server, start there.  These are also the entry points for webpack.
* `webpack` contains a webpack configuration for each entry point, as well as `webpack-dev-server.js` which sets up the dev server used during development.
* `modules` contains all of the code. Each module is a self-contained concept that may be used by other modules, command-line scripts, etc.
* `config` contains configuration files for our various environments. The default config is set up as a twelve-factor app to be hosted in heroku. Most variables can be controlled via the environment – see `config/default.js`.
* `dist` is where webpack stores compiled slices of the app.

## Running locally
Run `yarn dev` to start up both the server and client at the same time. You can use `yarn dev:server` and `yarn dev:client` to run them in separate terminal windows.

The dev server watches for changes and restarts `express` each time a dependency file changes.

The dev client is using the `webpack-dev-server` to hot reload the client whenever a file changes. Our webpack dev server is configured in `webpack/webpack-dev-server.js`.

To build for production, run:

```
NODE_ENV=production yarn build
```

This will build the entire app into `./dist/`.

## Tests
We are using Jest for unit testing, and colocating tests with the modules they’re testing.

Unit tests for a module are located in a `__tests__` directory  in the same directory as the file being tested.  Tests for `module.ts` should be named `module.test.ts`. Index files should be named after their parent directory. `some-module/index.ts` should be tested in `some-module/__tests__/module.test.ts`.

### Running Unit Tests

To run unit tests, run `yarn test`. This simply runs jest in the current directory, which will use config in the `jest` section of `package.json`.

To  run jest in watch mode, and have it automatically rerun tests when files change:

```
yarn test -- --watch
```

To see other jest options, you can run:

```
yarn test -- --help
```

### Property testing

We are using  [JSVerify](http://jsverify.github.io) for property-based testing. Property-based testing is based on generating arbitrary inputs for functions and asserting that properties are invariant across those inputs. If an input is found which violates the property, the library will automatically simplify it to the minimal case that reproduces the error.

### Generating test data

JSVerify has built-in test data generation helpers called `Arbitrary` values. It comes with built-in generators for various types, and `Arbitryary<T>` values can be composed together into larger types.  See the [JSVerify Readme](https://github.com/jsverify/jsverify).

By building up `Arbitrary` objects for our various types, we will have a library of test data generators which can also be used for property-based testing.

### Component tests

We are testing react components with [Enzyme](https://github.com/airbnb/enzyme) . See that for more information.

### System tests

A system test system is **not** in place yet. We’re currently looking at [Nightmare.js](https://github.com/segmentio/nightmare) for full system testing.

### Linting

We are using `tslint` for linting. It is run automatically before unit tests.

 
## Client Overview

The client has the following capabilities built-in:

* Apollo Client for GraphQL queries/mutations.
* Redux Saga for asynchronous workflows.
* A small lens library for state selectors/updates.

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

Instead of one monolithic stylesheet, each component should have its own `styles.css` which  it requires in it’s main module. This approach eases maintainability, as each react component has its own stylesheet, and webpack will only package up CSS for the components we actually use.

React components should be named with semantic, specific names. However, the CSS classes used for a React component should be as generic as possible.

Prefer using an existing component class name with a new `mod-` modifier to specify the behavior of your component versus adding a new css class per react component.

For example, it is better to have one `btn` class that has a different `mod-foo` modifier for the `FooButton` react component, than make a `foo-button` class.

See the Trello CSS guide for more info.

