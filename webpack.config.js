const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack")
const path = require('path');

const entries = {
  'main': ['./src/client/pages/main/index.ts'],
  'chatRoom': ['./src/client/pages/chatRoom/index.ts']
}

module.exports = {
  entry: entries,
  mode: process.env.NODE_ENV,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/index.[hash].js',
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader'
          }
        ],
      },
      {
        test: /\.gif/,
        type: 'asset/resource'
      },
      { 
        test: /\.tsx?$/, 
        loader: "ts-loader", 
        options: {
          configFile: 'tsconfigClient.json'
        } 
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    // 使用@來引入檔案
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  plugins: [
    // 針對兩個不同的頁面輸出
    new HtmlWebpackPlugin({
      filename: '[name]/main.html',
      chunks: ['main'],
      template: './src/client/pages/main/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: '[name]/chatRoom.html',
      chunks: ['chatRoom'],
      template: './src/client/pages/chatRoom/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name]/index.[hash].css'
    }),
    new CompressionPlugin(),
    //熱更新(更改程式碼會即時更新)
    new HotModuleReplacementPlugin(),  
  ],
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
}
// tree shaking: 過濾掉 沒有import的檔案然後打包