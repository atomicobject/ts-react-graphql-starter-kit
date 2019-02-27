if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    silent: false
  });
}

const CONCURRENCY = parseInt(process.env.WEB_CONCURRENCY, 10) || 1;
const WORKER_CONCURRENCY =
  parseInt(process.env.WORKER_CONCURRENCY, 10) || CONCURRENCY;

module.exports = {
  environment: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  minify: process.env.MINIFY === "true",

  production: process.env.NODE_ENV === "production",
  development: process.env.NODE_ENV === "development",
  test: process.env.NODE_ENV === "test",

  redis: {
    url: process.env.REDIS_URL,
    prefix: process.env.REDIS_PREFIX || "placement:",
  },

  rollbar: {
    serverAccessToken: process.env.ROLLBAR_ACCESS_TOKEN || null,
    clientAccessToken: process.env.ROLLBAR_CLIENT_ACCESS_TOKEN || null,
  },

  devServer: {
    url: "http://localhost",
    port: 3000,
    hot: true,
    inline: true,
    noInfo: true,
    disableHostCheck: ["1", "true"].includes(
      process.env.DEV_SERVER_DISABLE_HOST_CHECK
    ),
  },

  server: {
    port: process.env.PORT || 3001,
    apiHost: process.env.API_HOST || "localhost:3001",
    basicAuthPassword: process.env.BASIC_AUTH_PASSWORD || null,
    enableDeveloperLogin: process.env.ENABLE_DEVELOPER_LOGIN || false,
    secret: process.env.SERVER_SECRET,
    apiKey: process.env.API_KEY,

    publicHost: process.env.PUBLIC_HOST || "localhost:3000",
    requireSsl: process.env.REQUIRE_SSL !== "false",
    protocol: process.env.REQUIRE_SSL ? "https" : "http",

    graphiql: false,
    workers: CONCURRENCY,
    cluster: CONCURRENCY > 1,
  },
  jobs: {
    workers: WORKER_CONCURRENCY,
  },

};