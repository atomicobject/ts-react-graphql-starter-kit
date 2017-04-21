require("dotenv").config({ silent: false });

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  devServer: {
    url: 'http://localhost',
    port: 3000,
    hot: true,
    inline: true,
    noInfo: true,
  },
  server: {
    port: (process.env.PORT || 3001),
    apiHost: (process.env.API_HOST || "localhost:3001"),

    publicHost: (process.env.PUBLIC_HOST || "localhost:3000"),
    requireSsl: (process.env.REQUIRE_SSL !== 'false'),

    graphiql: false
  },
};
