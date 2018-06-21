const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
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
