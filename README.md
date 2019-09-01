# NodeSun

[![npm version][npm-version-image]](npm-url)
[![npm downloads][npm-download-image]](npm-url)

[npm-version-image]: https://img.shields.io/npm/v/nodesun.svg?style=flat-square
[npm-download-image]: https://img.shields.io/npm/dm/nodesun.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/nodesun

Node.js 开发小助手，监测文件变化，快速重启 Web 服务。

## 使用

全局安装 nodesun 依赖包（安装在当前项目中也可以，配置下 scripts 脚本即可）

```
npm i nodesun -g
```

使用 nodesun 启动你的 Web 服务

```
nodesun start index.js
```

index.js 示例

```js
// 尝试修改文件内容，服务会自动重启
const http = require('http');
const PORT = 3000;
const MESSAGE = `Hello，NodeSun!`;

const app = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });

  res.end(MESSAGE);
});

app.listen(PORT, () => {
  console.log(
    `Simple APP listenning on port ${PORT}, please visit http://localhost:${PORT}`
  );
});
```

## 参数配置

### --watch

配置需要 watch 的文件或者目录，默认为根目录下的所有 `.js` 文件，并且 watch 功能默认开启

```shell
# watch 根目录下的所有 js 文件（默认）
nodesun start index.js --watch '**/*.js'
# watch 某个文件夹
nodesun start index.js --watch src
# watch 根目录下的全部文件
nodesun start index.js --watch .
```

如果需要 watch 多个文件夹或者是更精确的文件配置，需要在 `nodesun.json` 文件里配置

## Todos

- [x] 支持配置 watch 的文件或者目录, 例如： `--watch ./foo`
- [ ] 支持通过 JSON 配置文件启动，配置可以写在 nodesun.json 里, 例如： `nodesun --config nodesun.json`

## License

[MIT License](./LICENSE)
