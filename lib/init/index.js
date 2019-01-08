const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const fsExtra = require('fs-extra')
const inquirer = require('inquirer')
const {
  cliPath,
  cwdPath
} = require('../utils/path-helper')
const log = require('../utils/log')
const {
  templateMap
} = require('./config')

function init (template) {
  const templateName = templateMap[template]
  if (!templateName) {
    const optionalTpl = Object.keys(templateMap).filter(n => n !== 'undefined')
    log.error(`可选的模板包括${optionalTpl.join(', ')}, 或者输入空，命令形如fev i ${optionalTpl[0]}`)
  }
  if (templateName.indexOf('lib') > -1) {
    generateLibTemplate(templateName)
  } else {
    generateCommonTemplate(templateName)
  }
}

async function generateLibTemplate (templateName) {
  const answer = await inquirer.prompt([{
    type: 'input',
    name: 'output',
    message: '请输入新建的文件夹名字',
    default: 'my-lib'
  }, {
    type: 'input',
    name: 'name',
    message: '请输入项目名'
  }, {
    type: 'input',
    name: 'description',
    message: '请输入项目描述',
  }, {
    type: 'input',
    name: 'author',
    message: '请输入作者名'
  }])
  const { name } = answer
  answer.formatName = formatName(name)
  answer.camelName = dashToCamel(answer.formatName)
  generate({
    output: answer.output,
    answer,
    templateName,
    success () {
      console.log()
      console.log('*******************************')
      log.success(`成功生成组件库${chalk.bold(name)}`)
      log.info(`cd ${answer.output}`)
      if (templateName === 'vue-lib') {
        log.info(`npm i`)
      }
      log.info(chalk.bold('运行以下命令进入开发模式'))
      log.info(`npm run dev`)
      console.log()
      log.info(chalk.bold('运行以下命令进入构建打包'))
      log.info(`npm run build`)
      console.log('*******************************')
      console.log()
    }
  })
}

// 生成通用模板 快速开始的模板，vue模板，react模板
async function generateCommonTemplate (templateName) {
  const answer = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: '请输入项目名',
    default: 'app'
  })
  const { name } = answer
  generate({
    output: name,
    answer,
    templateName,
    success () {
      console.log()
      console.log('*******************************')
      log.success(`成功生成项目${chalk.bold(name)}`)
      log.success('运行以下命令快速开始')
      log.info(`cd ${name}`)
      if (templateName !== 'quickstart') {
        log.info(`npm i`)
      }
      log.info(`fev d`)
      console.log('*******************************')
      console.log()
    }
  })
}

function generate ({
  success, templateName, answer, output
} = {}) {
  const { name } = answer
  const targetFolder = cwdPath(output)
  if (fs.existsSync(targetFolder)) {
    log.error(`当前目录已经存在${name}文件夹`)
  } else {
    fs.mkdirSync(targetFolder)
  }
  const templateFolder = cliPath(`./assets/template/${templateName}`)
  fileDisplay(templateFolder, (p, isDir) => {
    const relative = path.relative(templateFolder, p)
    const dist = path.join(targetFolder, relative)
    const str = fs.readFileSync(p, 'utf8')
      .replace(/\${(.*?)}/g, (total, item) => answer[item] || '')
    fsExtra.outputFileSync(dist, str)
  })
  success && success()
}

function fileDisplay (filePath, cb) {
  const files = fs.readdirSync(filePath)
  files.forEach(function (filename) {
    const filedir = path.join(filePath, filename)
    const stats = fs.statSync(filedir)
    const isFile = stats.isFile() //是文件
    const isDir = stats.isDirectory() //是文件夹
    if(isFile){
      cb(filedir)
    }
    if(isDir){
      fileDisplay(filedir, cb)
    }
  })
}

function dashToCamel (str) {
  if (/[a-z]/.test(str[0])) {
    str = str[0].toUpperCase() + str.substring(1)
  }
  return str.replace(/\-([a-z])/g, (a, b) => {
    return b.toUpperCase()
  })
}

function formatName (name) {
  return name.split('/')[1] ? name.split('/')[1] : name
}

module.exports = init
