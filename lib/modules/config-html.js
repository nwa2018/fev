const fs = require('fs')
const path = require('path')
const glob = require('glob')
const _ = require('lodash')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

exports.apply = api => {
  let {
    isProd,
    isLib,
    config: {
      templateFolder,
      html = {}
    }
  } = api
  if (isLib) {
    return api.merge({
      optimization: {
        minimizer: [
          new UglifyJsPlugin({
            sourceMap: false
          }),
          new OptimizeCSSAssetsPlugin({})
        ]
      }
    })
  }
  const plugins = []
  if (!templateFolder) {
    const tplPath = api.cliPath('assets/default.art')
    generateHtmlPluginConfig('index', tplPath)
  } else {
    templateFolder = api.cwdPath(templateFolder)
    const files = fs.readdirSync(templateFolder)
    files.forEach(filename => {
      if (filename[0] === '.') return
      const tplPath = path.join(templateFolder, filename)
      const stats = fs.statSync(tplPath)
      if (stats.isDirectory()) return
      const name = path.basename(tplPath, path.extname(tplPath))
      generateHtmlPluginConfig(name, tplPath)
    })
  }
  const rules = [
    {
      test: /\.art$/,
      use: 'art-template-loader'
    },
    {
      test: /\.html/,
      use: 'html-loader'
    },
    {
      test: [/\.pug$/, /\.jade$/],
      use: 'pug-plain-loader'
    }
  ]
  const optimization = isProd && {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 缓存公共库
          // TODO: 按需拆分vendor, minSize没有起作用，why
          name: `chunk-vendor`,
          test: new RegExp('[\\\\/]node_modules[\\\\/]'),
          priority: -10,
          chunks: 'initial'
        },
        common: {
          // 多页应用缓存公共部分
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    },
    // TODO: 抽取runtime后, 入口的entry使用了chunkFileName... https://github.com/webpack/webpack/issues/6598
    runtimeChunk: {
      name: 'runtime'
    }
  }
  api.merge({
    module: {
      rules
    },
    plugins
  }, optimization && {
    optimization
  })

  function generateHtmlPluginConfig (name, tplPath) {
    plugins.push(new HtmlWebpackPlugin(Object.assign({
      filename: `${name}.html`,
      template: tplPath,
      chunks: ['chunk-vendor', 'chunk-common', name],
      minify: isProd
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
          }
        : undefined
    }, html)))
  }
}
