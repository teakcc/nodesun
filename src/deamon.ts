import cluster from 'cluster';
// import http from 'http';
// import { exec, spawn, fork } from 'child_process';
import chalk from 'chalk';
import Watcher from './watcher';
import osInfo from './utils/os_info';

const isMaster = cluster.isMaster;
const isWorker = cluster.isWorker;

interface IDeamonOptions {
  rootPath: string;
  entry: string;
  watch: any;
  debug: boolean;
}

class Deamon {
  rootPath: string;
  entry: string;
  watch: any;
  debug: boolean;

  constructor(options: IDeamonOptions) {
    this.rootPath = options.rootPath;
    this.entry = options.entry;
    this.watch = options.watch;
    this.debug = options.debug;

    // console.log('root path');
    // console.log(this.rootPath);
    // console.log(this.entry);

    try {
      this.startWorkers();
    } catch (e) {
      // console.log(e);
    }
  }

  startWorkers() {
    // const workersNum = osInfo.cpuCores();
    // const entry = this.entry;
    const self = this;
    let watcher = undefined;

    if (isMaster) {
      cluster.setupMaster({
        silent: false,
      });

      // TODO: how to deal with stdout by multiple processes
      // this.forkProcess(workersNum);
      this.forkProcess(1);

      if (watcher && typeof watcher !== 'undefined') {
        watcher = undefined;
      }

      watcher = new Watcher({
        rootPath: this.rootPath,
        // TODO: handle argument by process.argv
        // now only watch javascript files in rootPath
        // DONE!
        watch: this.watch,
        handler() {
          self.restartWorkers.call(self);
        },
      });

      // TODO: print info optimize
      cluster.on('online', (worker: any) => {
        if (this.debug) {
          console.log(
            `${chalk.green('worker')} ${chalk.green.bold(
              worker.process.pid
            )} is online`
          );
        }
      });

      cluster.on('exit', (worker: any, code, signal) => {
        if (this.debug) {
          console.log(
            `${chalk.red('worker')} ${chalk.red.bold(
              worker.process.pid
            )} is died`
          );
        }
        cluster.fork();
      });
    }

    if (isWorker) {
      import(this.entry).catch(err => {
        console.log(err);
      });

      process.on('message', message => {
        if (message.type === 'shutdown') {
          process.exit(0);
        }
      });
    }
  }

  forkProcess(num: number) {
    let i = 0;
    while (i < num) {
      cluster.fork();
      i++;
    }
  }

  restartWorkers() {
    let wid,
      workerIds = [];

    for (wid in cluster.workers) {
      workerIds.push(wid);
    }

    // console.log(workerIds);

    try {
      workerIds.forEach(wid => {
        cluster.workers[wid].send({
          type: 'shutdown',
          from: 'master',
        });

        // fix if shutdown failed
        setTimeout(() => {
          if (cluster.workers[wid]) {
            cluster.workers[wid].kill('SIGKILL');
          }
        }, 3000);
      });
    } catch (e) {
      console.log(e);
    }
  }
}

export default Deamon;
