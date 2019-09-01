# nodesun documents

## Usage

Install nodesun

```shell
npm i nodesun -g
```

Start a application

```shell
nodesun start app.js
```

## Todos

Start a application with arguments

```shell
NODE_ENV=development nodesun start app.js --watch --name "myapp"
```

List all processes

```shell
nodesun list
```

Stop a process

```shell
nodesun delete <id|name>
```

Stop all processes

```shell
nodesun delete all
```
