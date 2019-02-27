## Package.json notes

Because you can't put comments in JSON. 😐

### Packages

- `jest-junit` - for test reporting in CI https://circleci.com/docs/2.0/collect-test-data/#jest

- `react-apollo` - this is our GraphQL client.

- `react-apollo-hooks`

  Unfortunately react-apollo doesn't yet provide a hooks API: https://github.com/apollographql/react-apollo/issues/2539 .

  This is a third-party lib that does.

#### Notes for future upgrades

- `apollo-link-state` - upgrading 0.4.1 -> 0.4.2 causes this:

  ```
  [build:client] ERROR in ./node_modules/graphql/index.mjs 64:0-98:42
  [build:client] Can't reexport the named export 'valueFromASTUntyped' from non EcmaScript module (only default export is available)
  [build:client] @ ./node_modules/apollo-link-state/lib/utils.js
  [build:client] @ ./node_modules/apollo-link-state/lib/index.js
  [build:client] @ ./modules/client/graphql/state-link.ts
  [build:client] @ ./modules/client/graphql/client.ts
  [build:client] @ ./entry/client.tsx
  [build:client] @ multi whatwg-fetch core-js/es6/object core-js/es6/array core-js/es6/symbol core-js/es6/promise core-js/es6/map core-js/es6/set ./entry/client.tsx
  [build:client]
  ```

- `knex` - knex 0.16.3 is [unable](https://github.com/tgriesser/knex/issues/3003) to automatically discover `knexfile.ts` the way previous versions could. For now we're using --knexfile all over the place; hopefully that can go away in some future version.

- `react-dom` - React 16.8.0 is the stable release that supports hooks. The main react package upgraded uneventfully, but react-dom has a few problems with enzyme. Keep an eye [this issue](https://github.com/airbnb/enzyme/issues/2011).

### Scripts

- `test:unit:ci` - Without specifying --maxWorkers, jest will automatically scales out to the number of hardware threads available. CircleCI is reporting the wrong number of hardware threads (os.cpus().length() in node) -- 36 instead of the ~2 we get from docker. So, for now (until we control concurrency separately across multiple Circle containers), we're specifying --maxWorkers to some number that won't starve for resources in CI.
