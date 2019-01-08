const fs = require('fs')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

exports.apply = api => {
  const {
    transpileModules = '',
    babelExclude,
    typescript = false
  } = api.config

  const babelOptions = require(api.cliPath('config/babel.config.js'))(api)

  const jsRule = getBabelLoaderOpt(/\.jsx?$/)
  const rules = [jsRule]
  if (typescript) {
    rules.push(getBabelLoaderOpt(/\.ts(x?)$/, [{
      loader: 'ts-loader',
      options: {
        happyPackMode: true,
        appendTsSuffixTo: ['\\.vue$'],
        // https://github.com/TypeStrong/ts-loader#happypackmode-boolean-defaultfalse
        transpileOnly: true
      }
    }]))
  }
  const tslintPath = api.cwdPath('tslint.json')
  api.merge({
    module: {
      rules
    },
    plugins: [
      typescript && new ForkTsCheckerWebpackPlugin({
        vue: true,
        formatter: 'codeframe',
        tslint: fs.existsSync(tslintPath) ? tslintPath: false,
        // https://github.com/TypeStrong/ts-loader#happypackmode-boolean-defaultfalse
        checkSyntacticErrors: true
      })
    ].filter(Boolean)
  })

  function isShouldTranspile (filePath) {
    if (!/node_modules/.test(filePath)) {
      return true
    }
    if (transpileModules) {
      const shouldTranspile = [].concat(transpileModules).some(name => {
        return filePath.includes(`/node_modules/${name}/`)
      })
      if (shouldTranspile) {
        return true
      }
    }
    return false
  }

  function getBabelLoaderOpt (test, loaders = []) {
    return {
      test,
      include: isShouldTranspile,
      exclude: babelExclude,
      use: [
        'thread-loader',
        {
          loader: 'babel-loader',
          options: babelOptions
        },
        ...loaders
      ]
    }
  }
}
