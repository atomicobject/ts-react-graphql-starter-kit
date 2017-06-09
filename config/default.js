require("dotenv").config({ silent: false });

const CONCURRENCY = parseInt(process.env.WEB_CONCURRENCY, 10) || 1

module.exports = {
  environment: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  minify: false,
  devServer: {
    url: 'http://localhost',
    port: 3000,
    hot: true,
    inline: true,
    noInfo: true,
    disableHostCheck: ['1','true'].includes(process.env.DEV_SERVER_DISABLE_HOST_CHECK)
  },
  server: {
    port: (process.env.PORT || 3001),
    apiHost: (process.env.API_HOST || "localhost:3001"),

    publicHost: (process.env.PUBLIC_HOST || "localhost:3000"),
    requireSsl: (process.env.REQUIRE_SSL !== 'false'),

    graphiql: false,
    workers: CONCURRENCY,
    cluster: CONCURRENCY > 1
  },
};
