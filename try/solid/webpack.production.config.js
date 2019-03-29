var path = require('path');
var webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
require("@babel/polyfill");
const outdir = 'solid'

module.exports={
  mode:'production',
  entry: [
    '@babel/polyfill',
    "./src/app.js",
  ],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, outdir)
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
  optimization: {
    splitChunks: {
      cacheGroups: {
       vendor: {
        test: /node_modules/,
        chunks: 'initial',
        name: 'vendor',
        enforce: true
       }
      }
    },
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CleanWebpackPlugin([outdir+'/*.js', outdir+'/*.js.map']),
    new HtmlWebpackPlugin({
      hash: false,
      template: './src/index.html',
      filename: './index.html'
    }),
  ]
}
