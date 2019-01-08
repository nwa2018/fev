const fs = require('fs')
const path = require('path')

module.exports = api => {
  return {
    apply (compiler) {
      compiler.hooks.compilation.tap('InlineFlexibleSource', compilation => {
        const hooks = require('html-webpack-plugin').getHooks(compilation)
        hooks.alterAssetTagGroups.tap('InlineFlexibleSource', assets => {
          assets.headTags.push({
            tagName: 'script',
            innerHTML: fs.readFileSync(path.join(__dirname, '../assets/flexible.js')),
            closeTag: true
          })
        })
      })
    }
  }
}
