const EslintFriendlyFormatter = require('eslint-friendly-formatter')

exports.apply = api => {
  const {
    config: {
      eslintConfig = {}
    }
  } = api
  if (!eslintConfig) return
  let config = require(api.cliPath('config/eslint.config'))(api)
  // process.exit()
  const rules = [{
    enforce: "pre",
    test: /\.(jsx?|vue|tsx?)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'eslint-loader',
        options: {
          baseConfig: Object.assign(config, eslintConfig)
        }
      }
    ]
  }]
  api.merge({
    module: {
      rules
    }
  })
}
