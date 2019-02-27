const host = /herokuapp.com/.test(process.env.PUBLIC_HOST)
  ? `${process.env.HEROKU_APP_NAME}.herokuapp.com`
  : process.env.PUBLIC_HOST;

module.exports = {
  minify: true,
  server: {
    cluster: true,
  },
};

if (host) {
  module.exports.server.publicHost = host;
}
