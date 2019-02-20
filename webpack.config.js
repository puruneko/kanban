// webpack.config.js

// require
const webpack = require("webpack");
var path = require("path");

// ユーザ定義変数
const jsdir = path.join('src','js');
const outputdir = 'dist';
const targetjs = ['index','tasks'];

//
let entryjs = {};
targetjs.forEach( function(name) {
    entryjs[name] = path.join(__dirname, jsdir, name, name + '.js');
});

const config = {
  mode: 'development',
  entry: entryjs,
  output: {
    path: path.resolve(__dirname, outputdir),
    filename: '[name].js'
  },
  //target:'electron-renderer',　  // 追加 renderer用
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel-loader',
        query:{
          presets: ['react'/*, 'es2015'*/],
        }
      },
      {
          test: /\.css$/,
          exclude: path.resolve(__dirname, 'node_modules'),
          use: {
              loader: 'css-loader',
          },
      },
    ]
  },
  /*
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  externals: {
    sqlite3: 'commonjs sqlite3',
    'sqlite3-offline': 'commonjs sqlite3-offline',
    path: 'commojs path'
  },
  */
};


module.exports = config;

