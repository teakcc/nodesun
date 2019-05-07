import fs from 'fs';
import path from 'path';

interface IWatcherOptions {
  rootPath: string;
  watch: any[];
  handler: Function;
}

class Watcher {
  rootPath: string;
  // watch type: .js
  // TODO: support RegExp
  watch?: string[];
  handler?: Function;
  exclude: RegExp;

  constructor(options: IWatcherOptions) {
    this.rootPath = options.rootPath;
    this.watch = options.watch || ['.js'];
    this.exclude = /node_modules/;
    this.handler = options.handler;

    this.watchFiles(this.rootPath);
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
        if (stat.isFile() && this.watch.indexOf(path.extname(newFile)) !== -1) {
          fs.watch(newFile, () => {
            this.handler && this.handler();
          });
        }
        // console.log(file);
      });
    });
  }
}

export default Watcher;
