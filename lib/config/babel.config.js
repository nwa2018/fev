const path = require('path')

module.exports = api => {
  const {
    resolve,
    isProd,
    config: {
      babel = {},
      jsx = 'vue',
      jsxPragmaFrag = 'React.Fragment',
      flow = false,
      typescript = false
    }
  } = api

  const isVueJSX = jsx === 'vue'
  const isReactJSX = jsx === 'react'

  const presets = [
    [
      resolve('@babel/preset-env'),
      {
        modules: false,
        targets: {
          ie: 9
        }
      }
    ],
    !isVueJSX && [
      resolve('@babel/preset-react'),
      {
        // 不清楚
        pragma: isReactJSX ? 'React.createElement' : jsx,
        pragmaFrag: jsxPragmaFrag
      }
    ],
    typescript && resolve('@babel/preset-typescript')
  ].filter(Boolean)
  const plugins = [
    flow && resolve('@babel/plugin-transform-flow-strip-types'),
    isVueJSX && resolve('@babel/plugin-syntax-jsx'),
    isVueJSX && resolve('babel-plugin-transform-vue-jsx'),
    resolve('@babel/plugin-syntax-dynamic-import'),
    [
      resolve('@babel/plugin-proposal-class-properties'),
      {
        loose: true
      }
    ],
    [
      resolve('@babel/plugin-proposal-object-rest-spread'),
      {
        useBuiltIns: true
      }
    ],
    resolve('babel-plugin-macros'),
    [
      resolve('@babel/plugin-transform-runtime'),
      {
        // 这个很重要，是的babel配置项cwd生效
        absoluteRuntime: true
      }
    ]
  ].filter(Boolean)
  const babelConfig = {
    cwd: path.join(__dirname, '../../'),
    cacheDirectory: api.cwdPath('node_modules/.cache/babel-loader'),
    cacheCompression: isProd,
    cacheIdentifier: 'babel-loader',
    presets,
    plugins
  }
  if (babel.presets) {
    babelConfig.presets = babelConfig.presets.concat(babel.presets)
    delete babel.presets
  }
  if (babel.plugins) {
    babelConfig.plugins = babelConfig.plugins.concat(babel.plugins)
    delete babel.plugins
  }
  Object.assign(babelConfig, babel)
  return babelConfig
}
