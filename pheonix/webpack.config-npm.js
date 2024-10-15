// This is a webpack configuration file for the test2.ts file
const path = require("path");
const NodePkgPlugin = require("../plugin/index.js");
const ApplyLicenseHeadersPlugin = require("./applyLicenseHeaders.js");

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'production',
  entry: "./src/cli.ts",
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
    new ApplyLicenseHeadersPlugin({
      licenseFileName: 'pheonixBox.js.LICENSE.txt',
      headers: {
        'cli': {
          author: 'Johnathan Edward Brown',
          purpose: 'CLI with worker thread entry point for the PheonixBox Class Object for the CLI Pheonix application.',
          license: 'X11 License'
        },
        'char': {
          author: 'Johnathan Edward Brown',
          purpose: 'Generate safe UTF-8 characters for use in the PheonixBox Class Object for the CLI Pheonix application.',
          license: 'X11 License'
        },
        'config': {
          author: 'Johnathan Edward Brown',
          purpose: 'Configuration class for the CLI Pheonix application.',
          license: 'X11 License'
        },
        'main': {
          author: 'Johnathan Edward Brown',
          purpose: 'Main entry point for the PheonixBox Class Object for the CLI Pheonix application.',
          license: 'X11 License'
        },
        'worker': {
          author: 'Johnathan Edward Brown',
          purpose: 'Worker class for the PheonixBox Class Object for the CLI Pheonix application.',
          license: 'X11 License'
        }
      }
    }),
    //new NodePkgPlugin('pheonixBox.js', 'pheonixBox')
  ],
  target: "node",
  devtool: "source-map",
  optimization: {
    usedExports: true,
    chunkIds: "named",
    minimize: true,
    mangleExports: true,
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