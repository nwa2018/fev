const fsExtra = require('fs-extra')

module.exports = api => {
  return {
    apply () {
      if (!api.isProd) return
      if (api.outputPath === api.cwdPath()) {
        api.warn('不清除当前工作目录')
        return
      }
      fsExtra.remove(api.outputPath)
    }
  }
}
