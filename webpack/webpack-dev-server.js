const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./client.config");
const config = require("config");

const { defaults } = require("lodash");

let devServer;
const DEV_PORT = config.get("devServer.port");

const PROXY_HOST = config.get("server.apiHost");

const startDevServer = () => {
  if (devServer) {
    return Promise.resolve(devServer);
  }

  const { hot, inline, noInfo } = defaults(config.get("devServer"), {
    hot: true,
    inline: true,
    noInfo: true,
  });

  // Set up hot reloading entry points.
  webpackConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin());
  webpackConfig.entry.app.unshift(
    `webpack-dev-server/client?http://localhost:${DEV_PORT}/`,
    "webpack/hot/dev-server"
  );
  return new Promise((resolve, reject) => {
    devServer = new WebpackDevServer(webpack(webpackConfig), {
      publicPath: webpackConfig.output.publicPath,
      hot: hot,
      inline: inline,
      historyApiFallback: true,
      noInfo: noInfo,
      stats: "errors-only",
      disableHostCheck: config.get("devServer.disableHostCheck"),
      proxy: {
        "/graphql/*": `http://${PROXY_HOST}`,
        "/graphiql/*": `http://${PROXY_HOST}`,
      },
    });

    setTimeout(function() {}, 10000);

    devServer.listen(DEV_PORT, err => {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.log(`WDS: Listening on port ${DEV_PORT}`);
      resolve();
    });
  });
};

const stopDevServer = () => {
  devServer.close();
  return Promise.resolve();
};

module.exports = { startDevServer, stopDevServer };
