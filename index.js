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

var clientArray = [];
io.on('connection', socket => {

  const ip = socket.handshake.address;
  const user = new class User{};
  user.ip = ip;
  user.id = Date.now();

  clientArray.push(user)

  console.log('a user connected',user);
  console.log(clientArray);

  socket.on('disconnect', reason => {
    console.log('user disconnected', {reason});
  });
  socket.on('new message', data => {
    console.log({data});
    messageHistory.push(data)
    socket.to(data.room).emit('receive message', data.message);
    console.log({messageHistory});
  });
  socket.on('room', data => {
    console.log('room join',data);
    socket.join(data.room);
  });
  //
  socket.on('leave room', data => {
    console.log('leaving room');
    console.log('leaving room',data);
    socket.leave(data.room)

  });
  //
  // socket.on('new message', data => {
  //   console.log("new message");
  //   socket.broadcast.to(data.room).emit('receive message', data)
  // });
  // socket.on('new message', data => {
  //   console.log(data.room);
  //   socket.broadcast
  //     .to(data.room)
  //     .emit('receive message', data)
  // });
});

server.listen(port);