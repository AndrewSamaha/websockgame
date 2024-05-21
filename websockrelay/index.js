// Setup basic express server
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const server = require('http').createServer(app);

const UserList = require('./lib/classes/UserList/UserList.js');
const Crons = require('./lib/classes/Crons/Crons.js');
const UnitRequests = require('./lib/classes/UnitRequests/UnitRequests.js');
const UnitState = require('./lib/classes/UnitState/UnitState.js');
const { makeBullet } = require('./lib/generators/bullet.js');
const { makeBug } = require('./lib/generators/bug.js');
const { makeResource } = require('./lib/generators/resource.js');

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

const unitState = new UnitState();
const userList = new UserList();
const crons = new Crons({ io, unitState, useSetImmediate: true });
const unitRequests = new UnitRequests({ io, unitState });

unitState.attachIO(io);


crons.addJob(200, unitRequests.processRequests.bind(unitRequests));
crons.addJob(50, unitState.tic.bind(unitState));
crons.addJob(600, () => {
  const bug = makeBug();
  bug.owner = {
    username: 'server',
    id: 'server'
  }
  unitState.addUnit(bug);
  io.emit('new unit v2', bug);
});
crons.addJob(1_000, () => {
  unitState.broadcastState({ io });
})
for (let i = 0; i < 10; i++) {
  const resource = makeResource();
  resource.owner = {
    username: 'server',
    id: 'server'
  }
  console.log(`resource at ${resource.pos.x},${resource.pos.y}`)
  unitState.addUnit(resource);
  io.emit('new unit v2', resource);
}

crons.start()

io.on('connection', (socket) => {
  console.log('connection')
  let addedUser = false;
  const user = userList.createNewUser(socket);
  socket.crons = crons;
  socket.unitRequests = unitRequests;
  socket.userList = userList;
  socket.emit('authenticate yourself');


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
      data: {
        ...unit,
        timeServerReceivedCreateUnitRequest: Date.now()
      }
    }
    // console.log('request create unit', request)
    unitRequests.addRequest(request)
  });

  // when the client emits 'add user', this listens and executes
  socket.on('login', (username) => {
    //if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    user.setUserName(username);

    ++numUsers;
    addedUser = true;
  
    const userJoinedObj = {
      username: socket.username,
      numUsers: numUsers,
      id: user.id
    }
    const userJoinedObjPrivate = {
      ...userJoinedObj,
      resources: {
        ore: 100,
        gold: 100,
        wood: 100
      }
    }
    socket.emit('loginSuccessful', userJoinedObjPrivate);
    socket.user = user;
    socket.broadcast.emit('user joined', userJoinedObj);
  
    console.log('adding user', user.username)
    // console.log(user)
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
