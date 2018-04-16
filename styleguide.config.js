const path = require('path');
const _ = require('lodash')
const config = require('config')

module.exports = {
  components: "modules/client/components/**/*.tsx",
  webpackConfig: _.merge({},
    require('./webpack/client.config.js'),
    {
      devServer: {
        disableHostCheck: config.get('devServer.disableHostCheck'),
      }
    }
  ),
  propsParser: require('react-docgen-typescript').parse,
  require: [
    './modules/client/styles/main.scss',
  ]
};