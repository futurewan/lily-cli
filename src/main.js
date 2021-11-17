import program from 'commander'
import chalk from 'chalk'
import init from './init'
import config from './config'
import { VERSION } from './utils/constants'

if (!process.argv.slice(2).length) {
  console.log('11111')
  program.outputHelp(makeGreen)
}
const actionMap = {
  init: {
    description: 'generate a new project from a template',
    usages: [
      'lily-create-cli init <projectName>'
    ]
  }
}

// 添加 init 命令
Object.keys(actionMap).forEach(action => {
  /**
   * 定义命令的选项 <> 必填 [] 可选
   * option('-n, --name <name>', 'your name', 'GK')
   *  */
  program.command(action)
    .description(actionMap[action].description)
    // .alias(actionMap[action].alias)
    .action(() => {
      const args = process.argv.slice(3)
      console.log('process.argv', args)
      switch (action) {
        case 'config':
          // 配置
          config(...args)
          break
        case 'init':
          if (!args.length) {
            console.log(chalk.red('请输入项目名'))
            program.outputHelp(makeGreen)
            return
          }
          init(...args)
          break
        default:
          break
      }
    })
})

function help () {
  console.log('\r\nUsage:')
  Object.keys(actionMap).forEach((action) => {
    actionMap[action].usages.forEach(usage => {
      console.log('  - ' + usage)
    })
  })
  console.log('\r')
}
program.usage('<command> [options]')
program.on('-h', help)
program.on('--help', help)

// 定义脚手架版本
program.version(VERSION, '-v, --version').parse(process.argv)
// .option('-i --init','init something')

function makeGreen (txt) {
  return chalk.green(txt)
}
