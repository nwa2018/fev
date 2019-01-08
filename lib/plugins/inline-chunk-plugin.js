const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = (api, options = {}) => {
  const { tests } = options

  const getInlinedTag = (publicPath, assets, tag) => {
    if (tag.tagName !== 'script' || !(tag.attributes && tag.attributes.src)) {
      return tag
    }
    const scriptName = tag.attributes.src.replace(publicPath, '')
    if (!tests.some(test => scriptName.match(test))) {
      return tag
    }
    const asset = assets[scriptName]
    if (asset == null) {
      return tag
    }
    return { tagName: 'script', innerHTML: asset.source(), closeTag: true }
  }
  return {
    apply (compiler) {
      let publicPath = compiler.options.output.publicPath;
      if (!publicPath.endsWith('/')) {
        publicPath += '/';
      }

      compiler.hooks.compilation.tap('InlineChunkHtmlPlugin', compilation => {
        const tagFunction = tag =>
          getInlinedTag(publicPath, compilation.assets, tag);

        const hooks = HtmlWebpackPlugin.getHooks(compilation);
        hooks.alterAssetTagGroups.tap('InlineChunkHtmlPlugin', assets => {
          assets.headTags = assets.headTags.map(tagFunction)
          assets.bodyTags = assets.bodyTags.map(tagFunction)
        })
      })
    }
  }
}
