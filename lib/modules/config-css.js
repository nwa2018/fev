const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin')

const px2remConfig = {
  rootValue: 75,
  propWhiteList: [],
  minPixelValue: 2
}
const autoprefixerConfig = {
  browsers: [
    'ie > 8',
    'Android >= 2.3',
    'iOS >= 7'
  ],
  cascade: true
}
exports.apply = api => {
  let {
    isProd,
    isDev,
    isLib,
    sourceMap,
    config: {
      minimize,
      extractCSS = true,
      loaderOptions = {},
      autoprefixer = true,
      px2rem = false,
      postcss = []
    }
  } = api
  // 开发环境不抽样式，不然加上css-hot-loader热重载也不生效
  if (isDev) {
    extractCSS = false
  }
  if (autoprefixer === true) {
    autoprefixer = autoprefixerConfig
  }
  sourceMap = !!sourceMap
  minimize = api.normalizeMinimize(minimize)
  const cssnanoOptions = {
    safe: true,
    autoprefixer: { disable: true },
    mergeLonghand: false,
    map: {
      inline: sourceMap ? false : true
    }
  }
  if (px2rem) {
    if (typeof px2rem === 'number') {
      px2remConfig.rootValue = px2rem
    } else if (typeof px2rem === 'object') {
      px2remConfig = px2rem
    }
  }
  const rules = []
  let plugins = []
  const createCSSRule = (lang, test, loader, options) => {
    const applyLoaders = (ruleUse, modules) => {
      if (isDev && !isLib) {
        ruleUse.push({
          loader: 'css-hot-loader'
        })
      }
      if (extractCSS) {
        ruleUse.push({
          loader: MiniCssExtractPlugin.loader
        })
      } else {
        ruleUse.push({
          loader: 'vue-style-loader',
          options: { sourceMap }
        })
      }
      ruleUse.push({
        loader: 'css-loader',
        options: Object.assign({
          sourceMap,
          modules,
          localIdentName: isProd ? '[local]_[hash:base64:5]' : '[path][name]__[local]--[hash:base64:5]',
          importLoaders: 2 + minimize ? 1 : 0
        }, loaderOptions.css)
      })
      if (minimize) {
        ruleUse.push({
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('cssnano')(cssnanoOptions)
            ]
          }
        })
      }
      ruleUse.push({
        loader: 'postcss-loader',
        options: Object.assign({
          sourceMap,
          plugins: [
            autoprefixer && require('autoprefixer')(autoprefixer),
            px2rem && require('postcss-pxtorem')(px2remConfig)
          ].filter(Boolean).concat(postcss)
        }, loaderOptions.postcss)
      })
      if (loader) {
        ruleUse.push({
          loader,
          options: Object.assign({ sourceMap }, options)
        })
      }
      return ruleUse
    }
    const rule = {
      test,
      oneOf: [{
        resourceQuery: /module/,
        use: applyLoaders([], true)
      }, {
        resourceQuery: /\?vue/,
        use: applyLoaders([], false)
      }, {
        test: /\.module\.\w+$/,
        use: applyLoaders([], true)
      }, {
        use: applyLoaders([], false)
      }]
    }
    rules.push(rule)
  }
  if (extractCSS) {
    plugins = plugins.concat([
      new MiniCssExtractPlugin({
        filename: isLib ? '[name].css' : '[name].[contenthash:4].css',
        chunkFilename: '[id].[contenthash:4].css'
      }),
      new OptimizeCssnanoPlugin({
        sourceMap,
        cssnanoOptions
      })
    ])
  }

  createCSSRule('css', /\.css$/)
  createCSSRule('postcss', /\.p(ost)?css$/)
  createCSSRule(
    'scss',
    /\.scss$/,
    'sass-loader',
    Object.assign({}, loaderOptions.sass)
  )
  createCSSRule(
    'sass',
    /\.sass$/,
    'sass-loader',
    Object.assign(
      {
        indentedSyntax: true
      },
      loaderOptions.sass
    )
  )
  createCSSRule('less', /\.less$/, 'less-loader', loaderOptions.less)
  createCSSRule(
    'stylus',
    /\.styl(us)?$/,
    'stylus-loader',
    Object.assign(
      {
        preferPathResolver: 'webpack'
      },
      loaderOptions.stylus
    )
  )
  if (px2rem) {
    // 内联flexible的脚本
    plugins.push(require('../plugins/inline-flexible-plugin')(api))
  }
  // console.log(JSON.stringify(rules, null, 2))
  // return rules
  api.merge({
    module: {
      rules
    },
    plugins
  })
}
