import downloadGit from 'download-git-repo'
import chalk from 'chalk'
import symbol from 'log-symbols'

export const downloadLocal = async (registry, templateName, projectName) => {
  return new Promise((resolve, reject) => {
    console.log('downloadGit', templateName, projectName)
    downloadGit(`${registry}/${templateName}`, projectName, (err) => {
      if (err) {
        console.log(symbol.error, chalk.red('download err'), err)
        reject(err)
      }
      resolve()
    })
  })
}
