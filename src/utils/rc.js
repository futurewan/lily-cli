import { promisify } from 'util'
import fs from 'fs'
import chalk from 'chalk'
import { decode, encode } from 'ini'
// import inquirer from 'inquirer'

import { RC, DEFAULTS } from './constants'

const stat = promisify(fs.stat) // 同步方式
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

export const fsStat = async (path, capture = true) => {
  try {
    return await stat(path)
  } catch (err) {
    if (capture) {
      console.log(chalk.red('读取文件出错'), path)
    }
    return null
  }
}

export const getConfig = async () => {
  const statRes = await fsStat(RC, false)
  let opts
  if (statRes) {
    opts = await readFile(RC, 'utf8')
    console.log('file object', opts)
    opts = decode(opts)
    return opts
  }

  return {}
}

// registry
export const setConfig = async (key, value) => {
  const rcOption = await fsStat(RC, false)
  let opts
  if (rcOption) {
    opts = await readFile(RC, 'utf8')
    opts = decode(opts)
    if (!key) {
      console.log(chalk.red(chalk.bold('Error:')), chalk.red('key is required'))
      return
    }
    if (!value) {
      console.log(chalk.red(chalk.bold('Error:')), chalk.red('value is required'))
      return
    }
    Object.assign(opts, { [key]: value })
  } else {
    console.log('DEFAULTS', DEFAULTS)
    opts = Object.assign(DEFAULTS, key && value ? { [key]: value } : {})
  }
  await writeFile(RC, encode(opts), 'utf8')
  console.log('创建配置文件成功')
}
