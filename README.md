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

- [ ] Module organization
- [ ] Running tests
- [ ] Async (redux sagas)
- [ ] Database
- [ ] Selectors/state updates – lens intro
- [ ] Bourbon/neat trello CSS guide
- [ ] Property-based testing


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

## Code Organization
This repository is structured to encourage a view of the whole repository as one application. The client and server are “just” different entry points, and we use webpack to elide libraries and code that are irrelevant to a particular entry point.

There are a few key directories:
* `entry` – contains the primary entry points of the application. If you want to see what happens when you start up the client or server, start there.  These are also the entry points for webpack.
* `webpack` contains a webpack configuration for each entry point, as well as `webpack-dev-server.js` which sets up the dev server used during development.
* `modules` contains all of the code. Each module is a self-contained concept that may be used by other modules, command-line scripts, etc.
* `config` contains configuration files for our various environments. The default config is set up as a twelve-factor app to be hosted in heroku. Most variables can be controlled via the environment – see `config/default.js`.
* `dist` is where webpack stores compiled slices of the app.
