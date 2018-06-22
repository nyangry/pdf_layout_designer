const path = require('path');
const src_directory = path.resolve(__dirname, 'src');
const dist_directory = path.resolve(__dirname, 'dist');

module.exports = {
  context: src_directory,
  mode: 'production',
  entry: './app.js',
  output: {
    path: dist_directory,
    filename: "app.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$|\.sass$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ]
  }
}
