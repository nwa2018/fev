const fs = require('fs')
const loadFevConfig = require('./utils/load-fev-config')
const serve = require('./modules/server')
const Utils = require('./utils')
// const clearConsole = require('./utils/clear-console')

module.exports = class Fev extends Utils {
  constructor (options = {}) {
    super(options)
    const {
      env = 'production',
      command = 'build',
      debug = false,
      cwd = ''
    } = options

    this.cwd = cwd
    this.debug = debug
    this.env = env
    this.command = command
    this.isDev = env === 'development'
    this.isProd = env === 'production'

    // 是否是本地调试线上代码
    this.isLocalTest = this.isProd && command === 'development'
    process.env.NODE_ENV = env

    this.config = loadFevConfig(this)

    this.log(`env: ${this.env}`)
    this.log(`command: ${this.command}`)
    this.log(`isLocalTest: ${this.isLocalTest}`)
    this.log(`debug: ${this.debug}`)
    this.log(`config: ${JSON.stringify(this.config, null, 2)}`)

    // 绑定Ctrl+C退出事件
    this.setUpExitEvent()

    // 初始化打包库文件时的参数
    this.setUpLibArgs()

    this.initWebpackConfig()

    this.applyModules()

    this.log(JSON.stringify(this.webpackConfig, null, 2))
    // process.exit()
    this.run()
  }

  setUpLibArgs () {
    const { format, moduleName } = this.config
    if (!format) return
    if (format !== 'cjs' && format !== 'umd') {
      this.error('format参数必须是cjs或者umd')
    }
    if (this.command === 'development') {
      this.error('fev.config.js含format字段的时候代表打包组件库，不允许开发命令fev d，请使用fev b')
    }
    this.format = format
    this.moduleName = moduleName
    this.isLib = true
  }

  normalizeMinimize (minimize) {
    return minimize === undefined
      ? this.isProd
      ? true
      : false
      : minimize
  }

  merge (...args) {
    this.webpackConfig = require('webpack-merge').smart(this.webpackConfig, ...args)
  }

  // Ctrl + C 断开进程
  setUpExitEvent () {
    const sigint = ['SIGINT', 'SIGTERM']
    sigint.forEach(sig => {
      process.on(sig, () => {
        // clearConsole()
        console.log('\n')
        process.exit()
      })
    })
  }

  initWebpackConfig () {
    this.sourceMap = this.isLib
      ? false
      : this.config.sourceMap === false
      ? false
      : this.env === 'production'
      ? 'source-map'
      : 'cheap-module-eval-source-map'
    this.webpackConfig = {
      target: 'web',
      mode: this.env,
      devtool: this.sourceMap
    }
  }

  applyModules () {
    fs.readdirSync(this.cliPath('./modules'))
      .filter(p => p.startsWith('config-'))
      .map(p => this.cliPath(`./modules/${p}`))
      .map(require)
      .map(module => module.apply && module.apply(this))
  }

  createWebpackCompiler() {
    return require('webpack')(this.webpackConfig)
  }

  build () {
    const compiler = this.createWebpackCompiler()
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(err, stats.compilation.errors)
      }
    })
  }

  mergeWebpackConfig () {
    let {
      webpack = {}
    } = this.config
    if (typeof webpack === 'function') {
      webpack = webpack(this, this.webpackConfig)
    }
    this.merge(webpack)
  }

  run () {
    this.mergeWebpackConfig()
    if (this.command === 'build') {
      this.build()
    } else {
      serve(this)
    }
  }
}
