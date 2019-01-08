const EslintFriendlyFormatter = require('eslint-friendly-formatter')

module.exports = api => {
  const {
    config: {
      jsx = 'vue',
      flow = false
    }
  } = api

  if (jsx === 'react') {
    return {
      extends: 'react-app'
    }
  }

  return {
    formatter: EslintFriendlyFormatter,
    extends: [flow && 'plugin:flowtype/recommended', 'standard', 'plugin:vue/recommended'].filter(Boolean),
    parserOptions: {
      parser: 'babel-eslint',
      sourceType: 'module',
      ecmaFeatures: 2017
    },
    plugins: [flow && 'flowtype'].filter(Boolean)
  }

}
