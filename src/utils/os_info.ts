import os from 'os';

function cpuCores() {
  return os.cpus().length;
}

export default {
  cpuCores,
};
