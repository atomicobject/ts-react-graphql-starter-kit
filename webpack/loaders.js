const config = require("config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");

module.exports = {
  typescript: {
    test: /\.tsx?/,
    use: [
      {
        loader: "awesome-typescript-loader",
        query: {
          configFileName: "./tsconfig.json"
        }
      }
    ]
  },

  graphql: {
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: "graphql-tag/loader"
  },

  scss: {
    test: /\.s?css$/,
    use: ExtractTextPlugin.extract({
      fallback: "style-loader",
      allChunks: true,
      use: [
        { loader: "css-loader" },
        {
          loader: "postcss-loader",
          options: {
            plugins: [
              ...(config.get("minify")
                ? [
                    require("cssnano")({
                      safe: true,
                      sourcemap: true,
                      autoprefixer: false
                    })
                  ]
                : []),
              require("autoprefixer")
            ]
          }
        },
        {
          loader: "sass-loader",
          options: {
            includePaths: [
              path.resolve(__dirname, "../modules" /*/client/styles"*/)
            ]
          }
        }
      ]
    })
  },

  allImagesAndFontsArray: [
    // cache bust images, but embed small ones as data URIs
    {
      test: /\.(png|jpg|jpeg|gif)$/,
      use: [
        {
          loader: "url-loader",
          query: {
            prefix: "img/",
            name: "assets/[hash].[ext]",
            limit: 5000
          }
        }
      ]
    },

    // cache bust svgs
    {
      test: /\.svg?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [
        {
          loader: "file-loader",
          query: {
            name: "assets/[hash].[ext]"
          }
        }
      ]
    },

    // cache bust fonts
    {
      test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [
        {
          loader: "file-loader",
          query: {
            name: "fonts/[hash].[ext]"
          }
        }
      ]
    },

    // Cache bust or data-uri web fonts
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [
        {
          loader: "url-loader",
          query: {
            limit: 50000,
            mimetype: "application/font-woff",
            name: "fonts/[hash].[ext]"
          }
        }
      ]
    }
  ]
};
