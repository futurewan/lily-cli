import downloadGit from 'download-git-repo'
import chalk from 'chalk'
import symbol from 'log-symbols'
import { getConfig } from './rc'

export const downloadLocal = async (templateName, projectName) => {
  const config = await getConfig()
  return new Promise((resolve, reject) => {
    console.log('downloadGit', templateName, projectName, config)
    downloadGit(`${config.registry}/${templateName}`, projectName, (err) => {
      if (err) {
        console.log(symbol.error, chalk.red('download err'), err)
        reject(err)
      }
      resolve()
    })
  })
}
