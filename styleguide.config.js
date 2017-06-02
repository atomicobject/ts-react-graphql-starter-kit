module.exports = {
  components: "modules/client/components/**/*.tsx",
  webpackConfig: require('./webpack/client.config.js'),
  propsParser: require('react-docgen-typescript').parse,
};