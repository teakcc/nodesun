import cluster from 'cluster';
// import http from 'http';
// import { exec, spawn, fork } from 'child_process';
import chalk from 'chalk';
import Watcher from './watcher';
// import osInfo from './utils/os_info';

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
  // Watcher instance
  watcher: any;

  constructor(options: IDeamonOptions) {
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
    } catch (e) {
      // console.log(e);
    }
  }

  startWorkers() {
    // const workersNum = osInfo.cpuCores();

    if (isMaster) {
      cluster.setupMaster({
        silent: false,
      });

      // TODO: how to deal with stdout by multiple processes
      // this.forkProcess(workersNum);
      this.forkProcess(1);

      this.createWatcherInstance();

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
        // this.watcher = null;
        cluster.fork();
        // this.createWatcherInstance();
      });
    }

    if (isWorker) {
      import(this.entry).catch(err => {
        console.log(err);
      });

      process.on('message', message => {
        // console.log('receive message');
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

  createWatcherInstance() {
    if (this.watcher) {
      this.watcher = null;
    }

    this.watcher = new Watcher({
      rootPath: this.rootPath,
      // TODO: handle argument by process.argv
      // now only watch javascript files in rootPath
      // DONE!
      watch: this.watch,
      handler: () => {
        this.restartWorkers.call(this);
      },
    });
  }

  restartWorkers() {
    // let wid: string;
    const workerIds = [];

    for (const wid in cluster.workers) {
      if (cluster.workers.hasOwnProperty(wid)) {
        workerIds.push(wid);
      }
    }

    // console.log(workerIds);

    try {
      workerIds.forEach((wid: string) => {
        cluster.workers[wid].send({
          type: 'shutdown',
          from: 'master',
        });

        // fix if shutdown failed
        setTimeout(() => {
          if (cluster.workers[wid]) {
            // console.log(cluster.workers[wid]);
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
