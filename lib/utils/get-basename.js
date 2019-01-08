const path = require('path')

module.exports = function (p) {
  return path.basename(p, path.extname(p))
}
