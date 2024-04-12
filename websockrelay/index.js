// Setup basic express server
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const server = require('http').createServer(app);

const UserList = require('./lib/classes/UserList/UserList.js')
const Crons = require('./lib/classes/Crons/Crons.js')

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());



const port = process.env.PORT || 3000;


server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')));

let numUsers = 0;

const userList = new UserList()
const crons = new Crons()

crons.addJob(2000, () => {
  userList.broadcast('new message', {
    username: 'server',
    message: `${Math.floor(Date.now()/1000)} I am the server message New Hotness`
  });
});

crons.start()

io.on('connection', (socket) => {
  console.log('connection')
  let addedUser = false;
  const user = userList.createNewUser(socket);

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  socket.on('request create unit', (unit) => {
    const request = {
      verb: 'createUnit',
      requester: user,
      time: Date.now(),
      data: unit
    }
    console.log('request create unit', request)
    userList.addNewRequest(request)
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    user.setUserName(username);

    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    const userJoinedObj = {
      username: socket.username,
      numUsers: numUsers,
      id: user.id
    }
    socket.broadcast.emit('user joined', userJoinedObj);
    console.log(userJoinedObj);

  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;
      userList.removeUser(user);

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});