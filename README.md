# obbo

Node.js 开发小助手，监测文件变化，多进程快速重启 Web 服务，保留原始日志输出。

## 使用

全局或者本地安装 obbo 依赖包`

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

## License

[MIT License](./LICENSE)
