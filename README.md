# obbo

[![npm version][npm-version-image]](npm-url)
[![npm downloads][npm-download-image]](npm-url)

[npm-version-image]: https://img.shields.io/npm/v/obbo.svg?style=flat-square
[npm-download-image]: https://img.shields.io/npm/dm/obbo.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/obbo

Node.js 开发小助手，监测文件变化，多进程快速重启 Web 服务，保留原始日志输出。

## 使用

全局安装 obbo 依赖包（安装在当前项目中也可以，配置下 scripts 脚本即可）

```
npm i obbo -g
```

使用 obbo 启动你的 Web 服务

```
obbo start index.js
```

index.js 示例

```js
// 尝试修改文件内容，服务会自动重启
const http = require('http');
const PORT = 3000;
const MESSAGE = `Hello，OBBO!`;

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

```
obbo start index.js --watch ./foo
```

## Todos

- [x] 支持配置 watch 的文件或者目录, 例如： `--watch ./foo`
- [ ] 支持通过 JSON 配置文件启动，配置可以写在 obbo.json 里, 例如： `obbo --config obbo.json`

## License

[MIT License](./LICENSE)
