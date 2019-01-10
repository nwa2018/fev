#!/usr/bin/env node
const log = require('../lib/utils/log')

if (process.version.match(/v(\d+)\./)[1] < 8) {
  log.error('fev: Node v8 or greater is required. `fev` did not run.')
} else {
  require('v8-compile-cache')
  require('./main')
}

