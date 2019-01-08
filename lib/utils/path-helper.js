const path = require('path')

const pathHelper = {
  cwdPath: (...args) => path.resolve(process.cwd(), ...args),
  cliPath: (...args) => path.join(__dirname, '../', ...args),
}

module.exports = pathHelper
