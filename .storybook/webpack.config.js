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
    {
      test: /\.s?css$/,
      loaders: [
        "style-loader",
        "css-loader",
        {
          loader: "sass-loader",
          options: {
            includePaths: [path.resolve(__dirname, "../modules")]
          }
        }
      ],
      include: path.resolve(__dirname, "../")
    },
    loaders.typescript,
    loaders.graphql
  );
  storybookBaseConfig.module.rules.concat(loaders.allImagesAndFontsArray);

  storybookBaseConfig.resolve.extensions.push(".ts", ".tsx");
  storybookBaseConfig.resolve.modules.unshift(
    path.resolve(__dirname, "../modules")
  );

  // Return the altered config
  return storybookBaseConfig;
};
