const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const mode = 'production';
const entry = path.resolve(__dirname, 'src/index.js');

const rules = [
  {
    test: /\.html$/i,
    loader: "html-loader",
  },
  {
    test: /\.(png|jpe?g|gif)$/i,
    loader: 'file-loader',
    options: {
      outputPath: 'images',
    },
  },
];

const plugins = [
  new HtmlWebpackPlugin({
    template: "./src/index.html"
  }),
  new ScriptExtHtmlWebpackPlugin({
    module: /\.mjs$/,
    custom: [
      {
        test: /\.js$/,
        attribute: 'nomodule',
        value: ''
      },
    ]
  })
];

const baseConfig = {
  mode,
  entry,
  output: {
    filename: 'bundle.mjs',
  },
  module: {
    rules:
      [
        ...rules,
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", {
                useBuiltIns: "usage",
                corejs: "3",
                targets: {
                  esmodules: true
                }
              }]
            ]
          }
        },
      ]
  },
  plugins,
};

const legacyConfig = {
  mode,
  entry,
  output: {
    filename: "[name].bundle.js"
  },
  module: {
    rules:
      [
        ...rules,
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", {
                useBuiltIns: "usage",
                corejs: "3",
                targets: {
                  esmodules: false
                }
              }]
            ]
          }
        },
      ]
  },
  plugins,
}

module.exports = [legacyConfig, baseConfig];
