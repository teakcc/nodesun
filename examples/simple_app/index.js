const http = require('http');

// change the message to test OBBO watch and restart feature
const MESSAGE = 'Hello!';

const app = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });

  res.end(MESSAGE);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(
    `Listenning on port ${PORT}, please visit http://localhost:${PORT}`
  );
});
