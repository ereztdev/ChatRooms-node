// const WebSocket = require('ws');
// const express = require('express');
//
// const app = express();
//
// const server = new WebSocket.Server({ server: app.listen(10101) });
//
// server.on('connection', socket => {
//   socket.on('message', message => {
//     console.log(`received from a client: ${message}`);
//   });
//   socket.send('Hello world!');
// });

const express = require('express');

const app = express();
const port = 3011;
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var messageHistory = [];
io.on('connection', socket => {
  console.log('a user connected');

  socket.on('disconnect', reason => {
    console.log('user disconnected');
  });
  socket.on('new message', data => {
    console.log('bdsfbdbdb', data);
  });


  // socket.on('room', data => {
  //   console.log('room join');
  //   console.log(data);
  //   socket.join(data.room);
  // });
  //
  // socket.on('leave room', data => {
  //   console.log('leaving room');
  //   console.log(data);
  //   socket.leave(data.room)
  // });
  //
  socket.on('new message', data => {
    console.log("socket.on('new message', data: ",data.room);
    socket.broadcast
      .to(data.room)
      .emit('receive message', data)
  });
  // socket.on('new message', data => {
  //   console.log(data.room);
  //   socket.broadcast
  //     .to(data.room)
  //     .emit('receive message', data)
  // });
});

server.listen(port);