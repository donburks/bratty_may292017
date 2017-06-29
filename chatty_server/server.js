const express = require('express');
const SocketServer = require('ws').Server;
const uuidV1 = require('uuid/v1');
const WebSocket = require('ws');
const request = require('request');
// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    message.type = 'textMessage';
    message.id = uuidV1();
    if (message.content[0] == '/') {
      let cmd_string = message.content.split(' ');
      let cmd = cmd_string.shift().replace('/', '');
      message.content = cmd_string.join(' '); 
      switch(cmd) {
        case 'me':
          message.type = 'meMessage';
          break;
        case 'gif':
          message.type = 'gifMessage';
          request(`http://api.giphy.com/v1/gifs/search?q=${message.content}&api_key=2666876f73f549b9a8ac8bbc3c67bc6a&rating=pg`, (err, response, body) => {
            let gifData = JSON.parse(body);
            let index = Math.floor(Math.random() * gifData.data.length); 
            message.url = gifData.data[index].images.original.url;
            wss.broadcast(JSON.stringify(message));
          });
          break;
        case 'random':
          message.type = 'gifMessage';
          request('http://api.giphy.com/v1/gifs/random?api_key=2666876f73f549b9a8ac8bbc3c67bc6a&rating=pg', (err, response, body) => {
            var gifData = JSON.parse(body);
            message.url = gifData.data.image_url; 
            wss.broadcast(JSON.stringify(message));
          });
          break;
        default:
          message.type = 'errorMessage';      
          break;
      } 
    } 
    if (message.type !== 'gifMessage') {
      wss.broadcast(JSON.stringify(message));
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
