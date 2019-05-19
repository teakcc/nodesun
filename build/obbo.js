'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var program = _interopDefault(require('commander'));
var chalk = _interopDefault(require('chalk'));
var cluster = _interopDefault(require('cluster'));
var chokidar = _interopDefault(require('chokidar'));
var fs = _interopDefault(require('fs'));

var Watcher = /** @class */ (function () {
    function Watcher(options) {
        this.rootPath = options.rootPath;
        this.watch = options.watch;
        // default only watch .js files
        this.watchExt = '.js';
        this.exclude = /node_modules/;
        this.handler = options.handler;
        var watchDir = this.rootPath;
        console.log('---- this.watch');
        console.log(this.watch);
        // --watch arguments only support string from CLI
        if (typeof this.watch === 'string' && /^\[.*\]$/.test(this.watch)) {
            this.watchFiles(this.watch);
            return;
            console.log("" + chalk.red('--watch arguments only support string from CLI, example: --watch ./foo'));
            process.exit(0);
        }
        if (typeof this.watch === 'string') {
            // if (!/^(\.|\*|\*\.js)$/.test(this.watch)) {
            //   watchDir = path.resolve(this.rootPath, this.watch);
            // }
            // if (!fsExists(watchDir)) {
            //   console.log(
            //     `${chalk.red.bold(watchDir)} ${chalk.red('is not exists')}`
            //   );
            //   return;
            // }
            // this.watchFiles(watchDir);
            this.watchFiles(this.watch);
        }
        // TODO
        // watch arguments from obbo.json config
        // eg: ['./controllers', './models']
        // if (Array.isArray(this.watch)) {
        //   this.watch.forEach(item => {
        //     watchDir = path.resolve(this.rootPath, item);
        //     if (!fsExists(watchDir)) {
        //       console.log(
        //         `${chalk.red.bold(watchDir)} ${chalk.red('is not exists')}`
        //       );
        //       return;
        //     }
        //     this.watchFiles(watchDir);
        //   });
        // }
    }
    // dir example: ., *.js, **/*.js, foo, foo/bar
    // patterns: https://github.com/micromatch/micromatch
    Watcher.prototype.watchFiles = function (dir) {
        var _this = this;
        var watcher = chokidar.watch(dir, {
            ignored: /node_modules/,
            persistent: true,
        });
        watcher.on('all', function (event, path) {
            // console.log(event, path);
            console.log(chalk.green("file " + chalk.bold(path) + " " + event + "..."));
            _this.handler && _this.handler();
        });
        // watcher.on('change', (path, stats) => {
        //   if (stats) console.log(`File ${path} changed size to ${stats.size}`);
        // });
        /*
        return;
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
        */
    };
    return Watcher;
}());
//# sourceMappingURL=watcher.js.map

// import osInfo from './utils/os_info';
var isMaster = cluster.isMaster;
var isWorker = cluster.isWorker;
var Deamon = /** @class */ (function () {
    function Deamon(options) {
        this.rootPath = options.rootPath;
        this.entry = options.entry;
        this.watch = options.watch;
        this.debug = options.debug;
        this.watcher = null;
        // console.log('root path');
        // console.log(this.rootPath);
        // console.log(this.entry);
        try {
            this.startWorkers();
        }
        catch (e) {
            // console.log(e);
        }
    }
    Deamon.prototype.startWorkers = function () {
        // const workersNum = osInfo.cpuCores();
        var _this = this;
        if (isMaster) {
            cluster.setupMaster({
                silent: false,
            });
            // TODO: how to deal with stdout by multiple processes
            // this.forkProcess(workersNum);
            this.forkProcess(1);
            this.createWatcherInstance();
            // TODO: print info optimize
            cluster.on('online', function (worker) {
                if (_this.debug) {
                    console.log(chalk.green('worker') + " " + chalk.green.bold(worker.process.pid) + " is online");
                }
            });
            cluster.on('exit', function (worker, code, signal) {
                if (_this.debug) {
                    console.log(chalk.red('worker') + " " + chalk.red.bold(worker.process.pid) + " is died");
                }
                // this.watcher = null;
                cluster.fork();
                // this.createWatcherInstance();
            });
        }
        if (isWorker) {
            Promise.resolve(require(this.entry)).catch(function (err) {
                console.log(err);
            });
            process.on('message', function (message) {
                // console.log('receive message');
                if (message.type === 'shutdown') {
                    process.exit(0);
                }
            });
        }
    };
    Deamon.prototype.forkProcess = function (num) {
        var i = 0;
        while (i < num) {
            cluster.fork();
            i++;
        }
    };
    Deamon.prototype.createWatcherInstance = function () {
        var _this = this;
        if (this.watcher) {
            this.watcher = null;
        }
        this.watcher = new Watcher({
            rootPath: this.rootPath,
            // TODO: handle argument by process.argv
            // now only watch javascript files in rootPath
            // DONE!
            watch: this.watch,
            handler: function () {
                _this.restartWorkers.call(_this);
            },
        });
    };
    Deamon.prototype.restartWorkers = function () {
        var wid, workerIds = [];
        for (wid in cluster.workers) {
            workerIds.push(wid);
        }
        // console.log(workerIds);
        try {
            workerIds.forEach(function (wid) {
                cluster.workers[wid].send({
                    type: 'shutdown',
                    from: 'master',
                });
                // fix if shutdown failed
                setTimeout(function () {
                    if (cluster.workers[wid]) {
                        // console.log(cluster.workers[wid]);
                        cluster.workers[wid].kill('SIGKILL');
                    }
                }, 3000);
            });
        }
        catch (e) {
            console.log(e);
        }
    };
    return Deamon;
}());
//# sourceMappingURL=deamon.js.map

// filePath must be a absolute path
function fsExists(filePath, ext) {
    var fileExt = path.extname(filePath);
    if (!fileExt && ext) {
        filePath += ext;
    }
    try {
        fs.accessSync(filePath);
    }
    catch (e) {
        return false;
    }
    return true;
}
//# sourceMappingURL=fs_exists.js.map

/**
 * OBBO
 * Process manager tool for Node.js application
 */
var ROOT_PATH = process.cwd();
var Obbo = /** @class */ (function () {
    function Obbo(options) {
        this.version = options.version;
        this.debug = options.debug;
    }
    Obbo.prototype.showBanner = function () {
        console.log('Hello, I am OBBO!');
        console.log("version: " + this.version);
    };
    Obbo.prototype.initProgram = function () {
        var debug = this.debug;
        program.version(this.version);
        program
            .command('start <entry>')
            .description('start a application from entry file')
            .option('-w, --watch [paths]', 'watch application folder for changes, default is project root dir')
            .action(function (entry, options) {
            var watch = options.watch;
            entry = path.resolve(ROOT_PATH, entry);
            if (typeof watch === 'undefined' || watch === true) {
                watch = '**/*.js';
            }
            if (!fsExists(entry, '.js')) {
                console.log(chalk.red.bold(entry) + " " + chalk.red('is not exists, you must provide a entry file or insure a index.js file in your project root directory'));
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
    };
    Obbo.prototype.run = function () {
        // this.showBanner();
        this.initProgram();
    };
    return Obbo;
}());
//# sourceMappingURL=obbo.js.map

module.exports = Obbo;
