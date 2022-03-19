'use strict';

const { Command } = require('commander');
const chalk = require('chalk');
const spawn = require('cross-spawn');

const init = require('./scripts/init');
const { makeGreen } = require('./scripts/utils/tools');
const { version, name } = require('../package.json');
// 当前 package.json 的版本号

function run() {
  const program = new Command();
  const actionMap = {
    init: {
      command: 'init <project-name>',
      description: '从模板项目初始化一个新项目',
      usage: '<project-name>',
    },
    build: {
      command: 'build',
      description: '项目打包',
    },
    start: {
      command: 'start',
      description: '启动开发环境项目',
    },
  };
  const args = process.argv.slice(2);
  const scriptIndex = args.findIndex(
    x => x === 'build' || x === 'start' || x === 'test'
  );
  const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

  // 添加 init 命令
  program
    .command(actionMap.init.command)
    .description(actionMap.init.description)
    .name('init')
    .usage(actionMap.init.usage)
    .action(name => {
      init(name);
    })
    .showHelpAfterError();

  program
    .command(actionMap.build.command)
    .description(actionMap.build.description)
    .option('-c,--config <configPath>', 'config file path')
    .action(() => {
      const result = spawn.sync(
        process.execPath,
        nodeArgs
          .concat(require.resolve('./scripts/build'))
          .concat(args.slice(scriptIndex + 1)),
        { stdio: 'inherit' }
      );
      process.exit(result.status);
    });

  program
    .command(actionMap.start.command)
    .description(actionMap.start.description)
    .option('-c,--config <configPath>', 'config file path')
    .action(() => {
      const result = spawn.sync(
        process.execPath,
        nodeArgs
          .concat(require.resolve('./scripts/start'))
          .concat(args.slice(scriptIndex + 1)),
        { stdio: 'inherit' }
      );
      process.exit(result.status);
    });
  program.name(name).usage(`<${Object.keys(actionMap).join('|')}> [options]`);
  // program.on('-h', help);
  // program.on('--help', help);

  // 定义脚手架版本
  program.version(version, '-v, --version');
  program.parse(process.argv);

  if (!args.length) {
    console.log(chalk.red('参数为0'));
    program.outputHelp(makeGreen);
    process.exit(1);
  }
  // function help() {
  //   console.log('\r\nUsage:');

  //   Object.keys(actionMap).forEach(action => {
  //     console.log('  - ' + actionMap[action].usage);
  //   });
  //   console.log('\r');
  // }
}

module.exports = run;
