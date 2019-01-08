const log = require('./utils/log')

const {
  cliPath,
  cwdPath
} = require('./utils/path-helper')

class Utils {
  constructor (options) {
    // console.log(this.cwd)
    this.cwd = options.cwd
  }

  log (...args) {
    this.debug && log.info(...args)
  }

  warn (...args) {
    log.warn(...args)
  }

  error (...args) {
    log.error(...args)
  }

  cliPath (...args) { return cliPath(...args) }

  cwdPath (...args) { return cwdPath(this.cwd, ...args) }

  resolve (...args) { return require.resolve(...args) }
}

module.exports = Utils
