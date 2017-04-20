const path = require('path');
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: './entry/server.ts',

  target: 'node',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'server.js',
  },

  resolve: {
    extensions: ['.ts', '.tsx','.js'],
  },

  externals: [nodeExternals()],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          configFileName: './tsconfig.json'
        }
      },
    ],
  },

};
