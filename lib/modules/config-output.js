exports.apply = api => {
  const {
    outputPath = 'dist',
    publicPath = ''
  } = api.config

  api.outputPath = api.cwdPath(outputPath)
  api.publicPath = publicPath

  const output = {
    path: api.outputPath,
    publicPath,
    // 库的话就不需要打hash戳了
    filename: api.isLib ?
      '[name].js'
      : api.isDev
      ? '[name].js'
      : '[name].[contenthash:4].js',
    // 非入口chunk的名字标识
    // TODO 设置runtimeChunk后入口chunk也使用chunkFilename
    chunkFilename: api.isDev ? '[name].chunk.js' : '[name].[contenthash:4].chunk.js'
  }
  if (api.isLib) {
    output.libraryTarget = api.format
    if (api.moduleName) {
      output.library = api.moduleName
    }
  }
  api.merge({ output })
}
