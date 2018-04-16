module.exports = {
  databaseUrl: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
  server: {
    publicHost: "localhost:3002",
    port: 3002,
    requireAuth: false,
    requireSsl: false,
    cluster: false
  }
};
