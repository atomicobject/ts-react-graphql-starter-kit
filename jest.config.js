module.exports = {
  forceExit: true,
  transform: {
    "\\.(js|jsx|ts|tsx)$": "ts-jest",
    "\\.(gql|graphql)$": "jest-transform-graphql"
  },
  transformIgnorePatterns: ["node_modules\\/(?!(lodash-es|react-apollo)\\/)"],
  testRegex: "modules/.*\\.(test|spec)\\.(ts|tsx)$",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js"
  },
  moduleDirectories: ["modules", "node_modules"],
  globalSetup: "./dist/scripts/unit-test-before-all.js",
  globals: {
    "ts-jest": {}
  },
  setupTestFrameworkScriptFile: "<rootDir>/modules/__tests__/setup-enzyme.js"
};
