// todo: put this in one place and import it
function envVarOrBust(s) {
  if (!s) {
    var e =
      "\n\n" +
      "========== CONFIGURATION ERROR! ==========\n" +
      "  Database env var is absent.             \n" +
      "  Did you symlink .env.example to .env?   \n" +
      "==========================================\n\n";
    console.log(e);
    throw e;
  }
  return s;
}

module.exports = {
  databaseUrl: envVarOrBust(
    process.env.DEV_DATABASE_URL || process.env.DATABASE_URL
  ),
  server: {
    requireSsl: false,
    enableDeveloperLogin: true,
    secret: "cat",
    graphiql: true,
    apiKey: "thisIsTheTestApiKey"
  },
};
