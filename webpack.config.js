const path = require('path');

module.exports = (env, argv) => {
  return {
    entry: './src/at.js',
    output: {
      filename: argv.mode === 'production' ? 'at.min.js' : 'at.js',
      path: path.resolve(__dirname, 'dist')
    }
  }
};
