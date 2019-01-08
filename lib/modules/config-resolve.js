const fs = require('fs')
const { arrayMerge } = require('../utils/merge')

exports.apply = api => {
  const {
    alias = {},
    extensions = [],
    resolveLoaderModules = []
  } = api.config
  const defaultAlias = {
    '@@': api.cwdPath()
  }
  if (fs.existsSync(api.cwdPath('./src'))) {
    defaultAlias['@'] = api.cwdPath('./src')
  }
  api.merge({
    resolve: {
      alias: Object.assign(defaultAlias, alias),
      extensions: arrayMerge(['.js', '.vue', '.styl', '.jsx', '.ts', '.css', '.scss', '.sass', '.art', '.pug', '.html'], extensions)
    },
    resolveLoader: {
      modules: arrayMerge([ api.cliPath('../node_modules'), api.cwdPath('node_modules') ], resolveLoaderModules)
    }
  })
}
