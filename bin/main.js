const cac = require('cac')
const Fev = require('..')
const log = require('../lib/utils/log')
const version = require('../package.json').version

const cli = cac()

// process.on('unhandledRejection', error => {
//   console.error('unhandledRejection', error)
//   // process.exit(1)
// })

cli.command('')
  .action(() => cli.outputHelp())

cli.command('init [template]', '生成模板')
  .alias('i')
  .action(template => require('../lib/init')(template))

cli.command('dev', '开发')
  .alias('d')
  .option('-e,--env <env>', '环境变量')
  .option('--cwd <cwd>', '工作的根目录')
  .option('--debug', '是否打印debug信息')
  .action(options => {
    const { env = 'development', debug = false, cwd = '' } = options
    if (!['development', 'production'].includes(env)) {
      log.error('env参数必须是development或者production')
    }
    new Fev({
      debug,
      command: 'development',
      env: env,
      cwd
    })
  })

cli.command('build', '打包文件')
  .alias('b')
  .option('--cwd <cwd>', '工作的根目录')
  .option('--debug', '是否打印debug信息')
  .action(options => {
    const { debug = false, cwd = '' } = options
    new Fev({
      debug,
      cwd,
      command: 'build',
      env: 'production'
    })
  })

cli.help()
cli.version(version)
cli.parse()
