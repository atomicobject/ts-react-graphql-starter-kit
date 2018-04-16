module.exports = {
  transform: {
    "\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    "\\.(gql|graphql)$": "jest-transform-graphql"
  },
  transformIgnorePatterns: ["node_modules\\/(?!(lodash-es|react-apollo)\\/)"],
  testRegex: ".*\\.(test|spec)\\.(ts|tsx)$",
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
