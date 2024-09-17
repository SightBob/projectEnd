// server.js
const WebSocket = require('ws');
const http = require('http');
const url = require('url');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', function connection(ws, req) {
  const parameters = url.parse(req.url, true);
  const userId = parameters.query.userId;
  
  if (userId) {
    clients.set(userId, ws);
  }

  console.log(`Client connected with userId: ${userId}`);
  
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    console.log('received:', data);
    
    const receiverWs = clients.get(data.receiver);
    if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
      receiverWs.send(JSON.stringify(data));
    }
  });

  ws.on('close', () => {
    clients.delete(userId);
    console.log(`Client disconnected: ${userId}`);
  });
});

server.listen(8080, () => {
  console.log('WebSocket server is running on ws://localhost:8080');
});