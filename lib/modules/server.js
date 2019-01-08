const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')

module.exports = async api => {
  const {
    isDev,
    isLocalTest,
    config: {
      devServer = {}
    }
  } = api
  const plugins = []
  const originPort = devServer.port || 4000
  const port = await require('get-port')({
    port: originPort,
    host: 'localhost'
  })
  // process.exit()
  if ((!devServer.port && port !== 4000) || (devServer.port && devServer.port !== port)) {
    api.warn(`Port ${
              originPort
            } has been used, switched to ${port}.`)
  }
  devServer.port = port

  const devServerConfig = Object.assign({
    quiet: true,
    hot: true,
    open: true,
    host: 'localhost',
    contentBase: api.cwdPath('dist'),
    port,
    historyApiFallback: true,
    overlay: true,
    disableHostCheck: true,
    watchOptions: {
      poll: false
    }
  }, devServer)
  // 本地调试线上代码得去掉热重载功能
  if (isLocalTest) {
    devServerConfig.hot = false
  }
  if (devServerConfig.hot) {
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  plugins.push(require('../plugins/server-success-tip-plugin')(api, devServerConfig))

  api.merge({
    plugins,
    // devServer: devServerConfig,
    output: {
      // 抄poi的没看懂
      // Point sourcemap entries to original disk location (format as URL on Windows)
      // Useful for react-error-overlay
      devtoolModuleFilenameTemplate: info => {
        return info.absoluteResourcePath.replace(/\\/g, '/')
      }
    }
  })
  // nodejs的接口需要调这个
  webpackDevServer.addDevServerEntrypoints(api.webpackConfig, devServerConfig)
  const compiler = api.createWebpackCompiler()

  const server = new webpackDevServer(compiler, devServerConfig)

  const openUrl = `${devServerConfig.https ? 'https' : 'http'}://${devServerConfig.host}:${devServerConfig.port}`
  if (devServerConfig.open) {
    require('opn')(openUrl)
  }
  server.listen(devServerConfig.port, devServerConfig.host, () => {})
}
