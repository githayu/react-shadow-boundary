const path = require('path');

module.exports = {
  entry: './src/index',

  output: {
    filename: 'react-shadow.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css', '.json']
  }
};