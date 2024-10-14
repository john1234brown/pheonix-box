const FlushPlugin = require('./flush.js'); // Your existing flush plugin
const CopyPlugin = require('./githubWorkspace.js');

module.exports = {
  // Webpack configuration
  entry: './src/app.js',
  mode: 'none',
  plugins: [
    new FlushPlugin(), // Runs before the build to flush directories
    new CopyPlugin({
      configFile: './configurable.json' // Path to the configuration file
    })
  ]
};
