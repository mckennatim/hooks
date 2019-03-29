var path = require('path');
var webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports={
  entry: {
    app: "./src/app.js",
    vendors: ['react', 'react-dom', 'rxjs']
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'signup')
  },
  module: {
    rules: [
      { test: /\.jsx?$/, 
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader" 
        }]
      },
      { test: /\.html$/, loader: "html-loader" }
    ],
  },
  devtool: "source-map",
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new CleanWebpackPlugin(['signup/*.js*']),
    new HtmlWebpackPlugin({
      hash: false,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({name: 'vendors', filename:'[name].bundle.js'})
  ]
}