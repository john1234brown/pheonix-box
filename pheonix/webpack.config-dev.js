// This is a webpack configuration file for the test2.ts file
const path = require("path");
const CopyWorkerPlugin = require('./plugin.js');
const NodePkgPlugin = require("../plugin/index.js");

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'development',
  entry: "/src/cli.ts",
  module: {
    rules: [
      {
        test: /\.ts/,
        use: "ts-loader",
        exclude: [/wip/, /disabled/]
      }
    ]
  },
  plugins: [
    new CopyWorkerPlugin(),
//    new NodePkgPlugin('pheonixBox.js', 'pheonixBox'),
  ],
  target: "node",
  devtool: "source-map",
  optimization: {
    usedExports: true,
    chunkIds: "named",
    minimize: false,
    mangleExports: false,
    moduleIds: "named"
  },
  externalsPresets: { node: true },
  // Remove the externals configuration to include all node modules
  output: {
    filename: "pheonixBox.js",
    path: path.resolve(__dirname, "production")
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@languages": path.resolve(__dirname, "../languages")
    }
  },
  cache: {
    type: 'filesystem', // Enable filesystem caching
    cacheDirectory: path.resolve(__dirname, '.webpack_cache'), // Specify cache directory
    buildDependencies: {
      config: [__filename], // Cache the config file itself
    },
  },
};