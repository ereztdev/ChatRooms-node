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
console.log({messageHistory});
  const ip = socket.handshake.address;
  const user = new class User {
  };
  user.ip = ip;
  user.id = Date.now();

  clientArray.push(user);

  console.log('a user connected', user);

  // console.log(clientArray);

  function sendRoomMsgHistory(room) {
    console.log('in sendRoomMsgHistory', room);
    var result = [];

    messageHistory.map((value) => {
      if (value.data.room === room) {
        result.push(value)
      }
    });
    return result;
  }

  socket.on('disconnect', reason => {
    console.log('user disconnected', {reason});
  });
  socket.on('new message', data => {
    messageHistory.push({user, data})
    console.log("new message",sendRoomMsgHistory(data.room));
    io.in(data.room).emit('RESPONSE_ROOM_MSGS', sendRoomMsgHistory(data.room));

    console.log(messageHistory,'**************************');
  });

  socket.on('room', data => {
    console.log('room join', data);
    socket.join(data.room);
    // socket.emit('GET_ROOM_MESSAGES', sendRoomMsgHistory(data.room) );
    var result = [];
    messageHistory.map((value) => {
      if (value.data.room === data.room) {
        result.push(value);
      }
    });
    console.log('roomChangemessages',result);
    socket.emit('RESPONSE_ROOM_MSGS',result);

  });
  //
  socket.on('leave room', data => {
    console.log('leaving room', data);
    socket.leave(data.room)
  });

  socket.on('QUERY_ROOM_MSGS', room => {
    // console.log(sendRoomMsgHistory(room));rs
    // socket.emit('RESPONSE_ROOM_MSGS',sendRoomMsgHistory(room));
    console.log({QUERY_ROOM_MSGS:room});
    var result = [];
    messageHistory.map((value) => {
      if (value.data.room === room) {
        result.push(value);
      }
    });
    socket.emit('RESPONSE_ROOM_MSGS',result);
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