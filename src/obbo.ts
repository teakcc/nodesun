/**
 * OBBO
 * Process manager tool for Node.js application
 */

interface IOptions {
  version: string;
}

class Obbo {
  version: string;

  constructor(options: IOptions) {
    this.version = options.version;
  }
  run() {
    console.log('Hello, I am OBBO!');
    console.log(`version: ${this.version}`);
  }
}

export default Obbo;
