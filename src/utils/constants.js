import { version } from '../../package.json'

// 当前 package.json 的版本号
export const VERSION = version

// 用户的根目录
const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']

// 配置文件目录
export const RC = `${HOME}/.lilyrc`

// 模板下载地址可配置
export const DEFAULTS = {
  registry: 'futurewan',
  type: 'users'
}
