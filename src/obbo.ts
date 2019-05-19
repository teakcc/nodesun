/**
 * OBBO
 * Process manager tool for Node.js application
 */

import path from 'path';
import program from 'commander';
import chalk from 'chalk';
import Deamon from './deamon';
import fsExists from './utils/fs_exists';

const ROOT_PATH = process.cwd();

interface IOptions {
  version: string;
  debug: boolean;
}

class Obbo {
  version: string;
  debug: boolean;

  constructor(options: IOptions) {
    this.version = options.version;
    this.debug = options.debug;
  }

  showBanner() {
    console.log('Hello, I am OBBO!');
    console.log(`version: ${this.version}`);
  }

  initProgram() {
    const debug = this.debug;
    program.version(this.version);

    program
      .command('start <entry>')
      .description('start a application from entry file')
      .option(
        '-w, --watch [paths]',
        'watch application folder for changes, default is project root dir'
      )
      .action((entry, options) => {
        let watch = options.watch;
        entry = path.resolve(ROOT_PATH, entry);

        if (typeof watch === 'undefined' || watch === true) {
          watch = '**/*.js';
        }

        if (!fsExists(entry, '.js')) {
          console.log(
            `${chalk.red.bold(entry)} ${chalk.red(
              'is not exists, you must provide a entry file or insure a index.js file in your project root directory'
            )}`
          );
          return;
        }

        new Deamon({
          rootPath: ROOT_PATH,
          entry: entry,
          watch: watch,
          debug: debug,
        });
      });

    program.parse(process.argv);

    if (program.args.length === 0) {
      program.help();
    }
  }

  run() {
    // this.showBanner();
    this.initProgram();
  }
}

export default Obbo;
