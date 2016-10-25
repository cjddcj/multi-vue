const fs = require('fs')
const webpack = require('webpack')
const merge = require('webpack-merge')

/* Config */
const port = 8080
const ip = require('../config/ip')
const urls = require('../urls')
const config = require('../config')
const webpackConfBase = require('./conf.base')
const loaders = require('./loaders')

/* Webpack Plugins */
const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const HappyPack = require('happypack')

const webpackConf = merge(webpackConfBase, {
  devtool: '#eval-source-map',
  entry: Object.assign({
    '[dev]': [
      `webpack-dev-server/client?http://${ip}:${port}`,
      'webpack/hot/dev-server',
    ]
  }, config.entry),
  module: {
    rules: loaders.style({ sourceMap: true })
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"development"' }
    }),
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new OpenBrowserPlugin({ url: `http://localhost:${port}/` }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.NamedModulesPlugin(),
    ...config.htmls.map(conf => new HtmlWebpackPlugin(conf))
  ]
})

fs.writeFileSync(`${urls.temp}/config.dev.json`, JSON.stringify(webpackConf, null, 2), 'utf8')

module.exports = webpackConf