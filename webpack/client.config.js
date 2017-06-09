const config = require('config');
const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SplitByPathPlugin = require('webpack-split-by-path');

////////////////////////////////////////////////////////////////////////////////
// per-environment plugins
const environmentPlugins = (() => {
  if (config.get("minify")) {
    return [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        minimize: true,
        compress: {
          unused: true,
          dead_code: true,
          warnings: false,
        },
      }),
    ]
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

////////////////////////////////////////////////////////////////////////////////
// Loaders
let compileTypescript = {
  test: /\.ts*/,
  use: [
    {
      loader: 'awesome-typescript-loader',
      query: {
        configFileName: './tsconfig.json'
      }
    }
  ]
};

let graphqlToJson =
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      };

let compileAndExtractSass = {
  test: /\.scss$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            ...config.get('minify')
              ? [require('cssnano')({
                safe: true,
                sourcemap: true,
                autoprefixer: false,
              })]
              : [],
            require('autoprefixer'),
          ]
        }
      },
      { loader: 'sass-loader' },
    ]
  })
};

let minifyCss = {
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          minimize: true,
          importLoaders: 1
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('cssnano')({
              safe: true,
              sourcemap: true,
              autoprefixer: false,
            }),
          ]
        }
      },
    ]
  })
};

const bundleStaticAssets = [
  // cache bust images, but embed small ones as data URIs
  {
    test: /\.(png|jpg|jpeg|gif)$/,
    use: [
      {
        loader: 'url-loader',
        query: {
          prefix: 'img/',
          name: 'assets/[hash].[ext]',
          limit: 5000
        }
      }
    ],
  },

  // cache bust svgs
  {
    test: /\.svg?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [
      {
        loader: 'file-loader',
        query: {
          name: 'assets/[hash].[ext]'
        }
      }
    ]
  },

  // cache bust fonts
  {
    test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [
      {
        loader: 'file-loader',
        query: {
          name: 'fonts/[hash].[ext]'
        }
      }
    ]
  },

  // Cache bust or data-uri web fonts
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [
      {
        loader: 'url-loader',
        query: {
          limit: 50000,
          mimetype: 'application/font-woff',
          name: 'fonts/[hash].[ext]'
        }
      }
    ]
  }
]
module.exports = {
  entry: {
    app: ['./entry/client.tsx']
  },

  devtool: process.env.NODE_ENV !== 'production' ? 'inline-source-map' : 'nosources-source-map',

  plugins: [
    // Define global letiables in the client to instrument behavior.
    new webpack.DefinePlugin({
      // Flag to detect non-production
      __DEV__: process.env.NODE_ENV !== 'production',

      // ALlow switching on NODE_ENV in client code
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    // Process index.html and insert script and stylesheet tags for us.
    new HtmlWebpackPlugin({
      template: './entry/index.html',
      inject: 'body',
    }),

    // Don't proceed in generating code if there are errors
    new webpack.NoEmitOnErrorsPlugin(),

    // Extract embedded css into a file
    new ExtractTextPlugin('[name].css'),

    // Show a nice progress bar on the console.
    new ProgressBarPlugin({ clear: false }),
  ].concat(environmentPlugins),

  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: 'client.js',
  },

  resolve: {
    extensions: ['.ts', '.tsx','.js', '.jsx', '.scss', '.css'],
  },

  module: {
    rules: [
      compileTypescript,
      graphqlToJson,
      compileAndExtractSass,
      minifyCss,
    ].concat(bundleStaticAssets)
  },
};
