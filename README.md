# obbo

Process manager tool for Node.js application, simple implementation of [PM2](https://github.com/Unitech/pm2)

## Todos

Install obbo

```shell
npm i obbo -g
```

Start a application

```shell
obbo start app.js
# or
NODE_ENV=development obbo start app.js --watch --name "myapp"
```

List all processes

```shell
obbo list
```

stop a process

```shell
obbo delete <id|name>
```

stop all processes

```shell
obbo delete all
```

## License

[MIT License](./LICENSE)
