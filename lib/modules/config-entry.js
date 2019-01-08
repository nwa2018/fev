const path = require('path')
const fs = require('fs')
const glob = require('glob')
const _ = require('lodash')
// const getBaseName = require('../utils/get-basename.js')

exports.apply = api => {
  let { entry = './src' } = api.config
  if (typeof entry === 'object') {
    return processEntryObject(api, entry)
  }
  const entryPath = api.cwdPath(entry)
  const stat = fs.lstatSync(entryPath)
  if (stat.isDirectory()) {
    return processEntryDir(api, entry)
  }
  api.merge({
    entry: {
      index: entryPath
    }
  })
}

function processEntryObject (api, entry) {
  api.merge({
    entry: _.mapValues(entry, api.cwdPath)
  })
}

function processEntryDir (api, entry) {
  const entryConfig = {}
  glob.sync(api.cwdPath(entry, '*.@(js|jsx)')).map(filePath => {
    const name = path.basename(filePath, path.extname(filePath))
    entryConfig[name] = filePath
  })
  api.merge({ entry: entryConfig })
}
