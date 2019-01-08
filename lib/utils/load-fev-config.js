const fs = require('fs')

module.exports = (api) => {
  let config = {}
  const fevConfigPath = api.cwdPath('fev.config.js')
  if (fs.existsSync(fevConfigPath)) {
    const fevConfig = require(fevConfigPath)
    config = typeof fevConfig === 'function' ? fevConfig(api) : fevConfig
  } else {
    api.warn('找不到fev.config.js，使用默认配置')
  }
  return config
}
