# obbo documents

## Usage

Install obbo

```shell
npm i obbo -g
```

Start a application

```shell
obbo start app.js
```

## Todos

Start a application with arguments

```shell
NODE_ENV=development obbo start app.js --watch --name "myapp"
```

List all processes

```shell
obbo list
```

Stop a process

```shell
obbo delete <id|name>
```

Stop all processes

```shell
obbo delete all
```
