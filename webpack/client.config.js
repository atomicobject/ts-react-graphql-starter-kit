const config = require("config");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const SplitByPathPlugin = require("webpack-split-by-path");
const CompressionPlugin = require("compression-webpack-plugin");
const loaders = require("./loaders");

////////////////////////////////////////////////////////////////////////////////
// per-environment plugins
const environmentPlugins = (() => {
  if (config.get("minify")) {
    return [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks: function(module) {
          // this assumes your vendor imports exist in the node_modules directory
          return (
            module.context && module.context.indexOf("node_modules") !== -1
          );
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "manifest" //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        minimize: true,
        comments: false,
        beautify: false,
        mangle: {
          screw_ie8: true
        },
        compress: {
          screw_ie8: true,
          unused: true,
          dead_code: true,
          warnings: false
        }
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.(js|html|css)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ];
  }

  switch (process.env.NODE_ENV) {
    case "development":
      return [
        // Hot reloading is set up in webpack-dev-server.js
      ];

    default:
      return [];
  }
})();

module.exports = {
  entry: {
    app: ["./entry/client.tsx"]
  },

  devtool:
    process.env.NODE_ENV !== "production"
      ? "inline-source-map"
      : "nosources-source-map",

  plugins: [
    // Define global letiables in the client to instrument behavior.
    new webpack.DefinePlugin({
      // Flag to detect non-production
      __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),

      // ALlow switching on NODE_ENV in client code
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),

    // Process index.html and insert script and stylesheet tags for us.
    new HtmlWebpackPlugin({
      template: "./entry/index.html",
      inject: "body"
    }),

    // Don't proceed in generating code if there are errors
    new webpack.NoEmitOnErrorsPlugin(),

    // Extract embedded css into a file
    new ExtractTextPlugin(
      config.get("minify") ? "[name].[chunkhash].css" : "[name].css"
    ),

    // Show a nice progress bar on the console.
    new ProgressBarPlugin({ clear: false })
  ].concat(environmentPlugins),

  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
    filename: config.get("minify") ? "client.[chunkhash].js" : "client.js"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    modules: [path.resolve(__dirname, "../modules"), "node_modules"]
  },

  module: {
    rules: [loaders.typescript, loaders.graphql, loaders.scss].concat(
      loaders.allImagesAndFontsArray
    )
  }
};
