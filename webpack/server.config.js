const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const loaders = require("./loaders");
const fs = require("fs");

const scriptsDir = path.join(__dirname, "../entry/scripts");

/** A map of of entry points for every file in scripts */
const scriptEntry = fs
  .readdirSync(scriptsDir)
  .filter(f => /\.tsx?$/.test(f))
  .filter(f => fs.statSync(path.join(scriptsDir, f)).isFile())
  .reduce((o, f) => {
    o[`scripts/${f.replace(/\.tsx?$/, "")}`] = path.resolve(
      path.join(scriptsDir, f)
    );
    return o;
  }, {});

const entry = Object.assign(
  {
    server: "./entry/server.ts"
  },
  scriptEntry
);
console.log(entry);

module.exports = {
  entry: entry,
  // Never minify the server
  mode: "development",

  //devtool: "source-map",
  devtool: "inline-source-map",
  optimization: {
    // Don't turn process.env.NODE_ENV into a compile-time constant
    nodeEnv: false
  },

  target: "node",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    libraryTarget: "commonjs2"
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
    rules: [loaders.typescript, loaders.graphql]
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    })
  ]
};
