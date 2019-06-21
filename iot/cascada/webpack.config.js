var path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require("@babel/polyfill");



module.exports={
  mode:'development',
  entry: ['@babel/polyfill', "./src/app.js"],
  plugins: [
    new CleanWebpackPlugin(['dist/*.js', 'dist/*.js.map']),
    new HtmlWebpackPlugin({
      hash: false,
      template: './src/index.html',
      filename: './index.html',
      title: 'mydogfood'
    })
  ],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.jsx?$/, 
        exclude: /node_modules/,
        use: [
          "babel-loader",
          "eslint-loader"
        ]
      },
      { test: /\.html$/, loader: "html-loader" },
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'}, 
          {loader: 'css-loader'} 
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              fallback: 'file-loader'
            }
          }
        ]
      }
    ],
  },
  devtool: "source-map",      
}