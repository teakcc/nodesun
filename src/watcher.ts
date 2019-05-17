import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import fsExists from './utils/fs_exists';

interface IWatcherOptions {
  rootPath: string;
  watch: any[];
  handler: Function;
}

class Watcher {
  rootPath: string;
  // watch type: .js
  // TODO: support RegExp
  // watch paths maybe: .(default) | ./src | ['./models', './controllers']
  watch?: string | string[];
  watchExt: string;
  handler?: Function;
  exclude: RegExp;

  constructor(options: IWatcherOptions) {
    this.rootPath = options.rootPath;
    this.watch = options.watch;
    // default only watch .js files
    this.watchExt = '.js';
    this.exclude = /node_modules/;
    this.handler = options.handler;

    let watchDir = this.rootPath;

    // --watch arguments only support string from CLI
    if (typeof this.watch === 'string' && /^\[.*\]$/.test(this.watch)) {
      console.log(
        `${chalk.red(
          '--watch arguments only support string from CLI, example: --watch ./foo'
        )}`
      );
      process.exit(0);
    }

    if (typeof this.watch === 'string') {
      if (!/^(\.|\*|\*\.js)$/.test(this.watch)) {
        watchDir = path.resolve(this.rootPath, this.watch);
      }
      if (!fsExists(watchDir)) {
        console.log(
          `${chalk.red.bold(watchDir)} ${chalk.red('is not exists')}`
        );
        return;
      }
      this.watchFiles(watchDir);
    }

    // TODO
    // watch arguments from obbo.json config
    // eg: ['./controllers', './models']
    if (Array.isArray(this.watch)) {
      this.watch.forEach(item => {
        watchDir = path.resolve(this.rootPath, item);
        if (!fsExists(watchDir)) {
          console.log(
            `${chalk.red.bold(watchDir)} ${chalk.red('is not exists')}`
          );
          return;
        }
        this.watchFiles(watchDir);
      });
    }
  }

  watchFiles(dir: string) {
    fs.readdir(dir, (err, files) => {
      // console.log(files);
      files.forEach(file => {
        if (this.exclude.test(file)) {
          return;
        }
        let newFile = path.resolve(dir, file);
        // console.log(newFile);
        let stat = fs.lstatSync(newFile);
        if (stat.isDirectory()) {
          // recursion
          this.watchFiles(newFile);
        }
        if (
          stat.isFile() &&
          this.watchExt.indexOf(path.extname(newFile)) !== -1
        ) {
          fs.watchFile(newFile, {}, (curr, prev) => {
            if (curr.mtime !== prev.mtime) {
              console.log(chalk.green('file changes...'));
              this.handler && this.handler();
            }
          });
        }
        // console.log(file);
      });
    });
  }
}

export default Watcher;
