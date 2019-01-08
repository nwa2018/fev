const ora = require('ora')
const spinner = ora()

const ProgressPlugin = require('webpack').ProgressPlugin
const homeRe = new RegExp(require('os').homedir(), 'g')

module.exports = api => {
  return new ProgressPlugin((per, message, ...args) => {
    const msg = `${(per * 100).toFixed(2)}% ${message} ${args
      .map(arg => {
        const message = arg.replace(homeRe, '~')
        return message.length > 40
          ? `...${message.substr(message.length - 39)}`
          : message
      })
      .join(' ')}`

    if (per === 0) {
      spinner.start(msg)
    } else if (per === 1) {
      spinner.stop()
    } else {
      spinner.text = msg
    }
  })
}
