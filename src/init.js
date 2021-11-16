import fs from 'fs'
import ora from 'ora'
import inquirer from 'inquirer'
import chalk from 'chalk'
import symbol from 'log-symbols'
import { downloadLocal } from './utils/download'
import { getAll, setConfig } from './utils/rc'

const createProject = (projectName) => {
  if (!fs.existsSync(projectName)) {
    inquirer.prompt([
      {
        name: 'templateName',
        message: '请输入模版名称',
        default: 'react-base-project'
      },
      {
        name: 'description',
        type: 'input',
        message: '请输入项目的描述'
      },
      {
        name: 'author',
        message: '请输入作者名'
      }
    ]).then((answer) => {
      console.log('answer', answer)
      const { templateName, description, author } = answer
      const loading = ora('downloading template ...')
      loading.start()
      downloadLocal(templateName, projectName).then(() => {
        loading.succeed()
        const fileName = `${projectName}/package.json`
        // 修改package.json 信息
        if (fs.existsSync(fileName)) {
          const data = fs.readFileSync(fileName).toString()
          const json = JSON.parse(data)
          json.name = projectName
          json.author = author
          json.description = description
          fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8')
          console.log(symbol.success, chalk.green('Project initialization finished!'))
        }
      }, (err) => {
        if (err) {
          console.log(symbol.error, chalk.green('项目初始化失败！'), err)
        }
        loading.fail()
      })
    })
  } else {
    console.log('\n', symbol.error, chalk.red('The project already exists'))
  }
}

// 初始化工程
const init = async (projectName) => {
  const config = await getAll() || {}
  console.log('config', config)

  // 未配置仓库地址
  if (!config.registry) {
    inquirer.prompt([{
      name: 'isCreate',
      message: '您还没有配置仓库信息，是否使用默认配置',
      type: 'confirm'
    }]).then(async (answer) => {
      const { isCreate } = answer
      console.log('isCreate', isCreate)
      // 使用默认配置
      if (isCreate) {
        await setConfig()
        createProject(projectName)
      } else {
        inquirer.prompt([{
          name: 'registry',
          message: '请输入仓库名称'
        }]).then((config) => {
          const { registry } = config
          if (registry) {
            setConfig('registry', registry)
          } else {
            console.log('退出创建')
          }
        })
      }
    }).catch(err => {
      console.log('读取配置文件出错', err)
    })
    return false
  }

  createProject(projectName)
}

export default init
