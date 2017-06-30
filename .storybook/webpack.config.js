const path = require("path");
const loaders = require("../webpack/loaders");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  storybookBaseConfig.module.rules.push(
    // {
    //   test: /\.scss$/,
    //   loaders: ["style-loader", "css-loader", "sass-loader"],
    //   include: path.resolve(__dirname, "../")
    // },
    loaders.scss,
    loaders.typescript,
    loaders.graphql
  );
  storybookBaseConfig.module.rules.concat(loaders.allImagesAndFontsArray);

  storybookBaseConfig.resolve.extensions.push(".ts", ".tsx");
  storybookBaseConfig.plugins.push(new ExtractTextPlugin("[name].css"));

  // Return the altered config
  return storybookBaseConfig;
};
