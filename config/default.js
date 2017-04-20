require("dotenv").config({ silent: false });

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  devServer: {
    url: 'http://localhost',
    port: 3000,
    hot: true,
    inline: true,
    noInfo: true,
    apiProxyHost: "localhost:3001",
  },
  server: {
    port: (process.env.PORT || 3001),
    publicHost: "localhost:3000",
    requireAuth: (process.env.REQUIRE_AUTH !== 'false'),
    authorizedUserString: process.env.AUTHORIZED_USERS || 'admin: cody-brant-dandruff;',
    requireSsl: (process.env.REQUIRE_SSL !== 'false'),
  },
};
