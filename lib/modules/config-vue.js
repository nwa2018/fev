const VueLoaderPlugin = require('vue-loader/lib/plugin')

exports.apply = api => {
  const rules = [{
    test: /\.vue$/,
    use: [
      {
        loader: 'cache-loader',
        options: {
          cacheDirectory: api.cwdPath('node_modules/.cache/vue-loader'),
          cacheIdentifier: 'vue-loader'
        }
      },
      {
        loader: 'vue-loader',
        options: {
          // TODO: error with thread-loader，到时再看poi
          // compiler: api.resolve('vue-template-compiler')
        }
      }
    ]
  }]

  const plugins = [
    new VueLoaderPlugin()
  ]

  api.merge({
    module: {
      rules
    },
    plugins
  })
}
