const chalk = require('chalk')
const address = require('address')
const clearConsole = require('../utils/clear-console')

const ip = address.ip()

module.exports = (api, devServerConfig) => {
  return {
    apply (compiler) {
      let isFirstBuild = true
      compiler.hooks.done.tap('print-serve-urls', stats => {
        if (stats.hasErrors() || stats.hasWarnings()) return
        clearConsole()
        let msg = `\n  ${chalk.green('App running at:')}`
        msg += `\n${chalk.bold(`  - Local:           http://${devServerConfig.host}:${chalk.bold(devServerConfig.port)}`)}`
        msg += `\n${chalk.dim(`  - On Your Network: http://${ip}:${chalk.bold(devServerConfig.port)}`)}\n`

        console.log(msg)

        isFirstBuild = false
      })
    }
  }
}
