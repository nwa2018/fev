const chalk = require('chalk')

function log(label, ...msg) {
  console.log(label, ...msg)
}

exports.success = function (...msg) {
  log(chalk.green('success'), ...msg)
}

exports.error = function (...msg) {
  log(chalk.red('error'), ...msg)
  process.exit()
}

exports.warn = function (...msg) {
  log(chalk.yellow('warning'), ...msg)
}

exports.info = function (...msg) {
  log(chalk.cyan('info'), ...msg)
}
