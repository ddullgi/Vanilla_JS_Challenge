const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode,
  entry: {
    main: "./src/app.ts",
  },
  devtool: "inline-source-map",
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
    chunkFilename: "js/[name].chunk.js",
  },
  stats: "errors-only",
  devServer: {
    open: true,
    port: 8080,
    proxy: {},
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/i,
        use: [
          mode === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(gif|jpe?g|png|webp|svg)$/i,
        type: "asset",
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleString()}
        Commit Version: ${childProcess.execSync("git rev-parse --short HEAD")}
        Author: ${childProcess.execSync("git config user.name")}
      `,
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      templateParameters: {
        env: mode === "development" ? "(개발용)" : "",
      },
      minify:
        mode === "development"
          ? false
          : {
              collapseWhitespace: true,
              removeComments: true,
            },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/axios/dist/axios.min.js",
          to: "./axios.min.js",
        },
      ],
    }),
    new CleanWebpackPlugin(),
    ...(mode === "development"
      ? []
      : [new MiniCssExtractPlugin({ filename: "[name].css", chunkFilename: "[id].css" })]),
  ],
  optimization: {
    minimizer:
      mode === "production"
        ? [
            new CssMinimizerPlugin(),
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true,
                },
              },
            }),
          ]
        : [],
    splitChunks: {
      chunks: "all",
    },
  },
  externals: {
    axios: "axios",
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        extensions: [".js", ".ts"],
      }),
    ],
    extensions: [".js", ".ts"],
  },
};
