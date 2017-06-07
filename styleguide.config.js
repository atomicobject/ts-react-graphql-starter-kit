const path = require('path');
module.exports = {
  components: "modules/client/components/**/*.tsx",
  webpackConfig: require('./webpack/client.config.js'),
  propsParser: require('react-docgen-typescript').parse,
  require: [
    './modules/client/styles/main.scss',
  ]
};