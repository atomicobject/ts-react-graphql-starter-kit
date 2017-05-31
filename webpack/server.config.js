const path = require('path');
const nodeExternals = require("webpack-node-externals");
const webpack = require('webpack');

module.exports = {
  entry: './entry/server.ts',

  devtool: 'source-map',
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'server.js',
  },

  resolve: {
    extensions: ['.ts', '.tsx','.js'],
  },

  externals: [nodeExternals({
    whitelist: [/^lodash-es/],
  })],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          configFileName: './tsconfig.json'
        }
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    ],
  },

  plugins: [
    new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false })
  ]

};
