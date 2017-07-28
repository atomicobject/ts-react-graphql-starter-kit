const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const loaders = require("./loaders");

module.exports = {
  entry: "./entry/server.ts",

  //devtool: "source-map",
  devtool: 'inline-source-map',

  target: "node",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "server.js",
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.resolve(__dirname, "../modules"), "node_modules"]
  },

  externals: [
    nodeExternals({
      whitelist: [/^lodash-es/]
    })
  ],
  module: {
    loaders: [loaders.typescript, loaders.graphql]
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    })
  ]
};
