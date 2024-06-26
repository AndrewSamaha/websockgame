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
const { PLAYER_COLORS } = require('./lib/constants/playerColors.js');

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let numUsers = 0;
const port = process.env.PORT || 3000;

const unitState = new UnitState();
const userList = new UserList();
const crons = new Crons({ io, unitState, useSetImmediate: true });
const unitRequests = new UnitRequests({ io, unitState, userList });

app.use(cors());
app.use((req, res, next) => {
    req = {
        ...req,
        unitState,
        userList,
        crons,
        unitRequests
    };
    next();
})

app.get('/availableColors', (req, res) => {
    let availableColors = userList.users.reduce((acc, user) => {
        acc.splice(acc.indexOf(user.color), 1);
        return acc;
    }, [...PLAYER_COLORS])
    res.json(availableColors);
});





server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')));



unitState.attachIO(io);


crons.addJob(200, unitRequests.processRequests.bind(unitRequests));
crons.addJob(50, unitState.tic.bind(unitState));
crons.addJob(200, () => { unitState.broadcastState({ io }); })
crons.addJob(2_000, unitState.echoStatus.bind(unitState));

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

    socket.on('request unit action', ({unit, action}) => {
        console.log({ unit })
        const { actionName, actionData } = action;
    
        console.log('actionName: ', actionName)
        console.log({ actionData })
        console.log({ unitOwnerId: unit.owner.id, userId: user.id })
        if (unit.owner.id !== user.id) {
            console.log('unit owner id does not match user id')
            return;
        }
        
        const request = {
            verb: 'unitAction',
            requester: user,
            time: Date.now(),
            data: {
                ...action,
                unit,
                timeServerReceivedCreateUnitRequest: Date.now()
            }
        }
        // console.log('request create unit', request)
        unitRequests.addRequest(request)
    })

    // when the client emits 'add user', this listens and executes
    socket.on('login', (userFromClient) => {
    //if (addedUser) return;
        const { username, color } = userFromClient;
        // we store the username in the socket session for this client
        socket.username = username;
        user.setUserName(username);
        user.setUserColor(color);
        user.loadState();

        ++numUsers;
        addedUser = true;
  
        const userJoinedObj = {
            username: socket.username,
            numUsers: numUsers,
            id: user.id
        }
        const userJoinedObjPrivate = {
            //...userJoinedObj,
            resources: {
                ore: 100,
                gold: 100,
                wood: 100
            },
            ...user.toJson()
        }
        socket.emit('loginSuccessful', userJoinedObjPrivate);
        socket.user = user;
        socket.broadcast.emit('user joined', userJoinedObj);
  
        console.log('adding user', user.username)
        console.log(user)
    });

    socket.on('user command', (command) => {
        console.log('user command', command)
        const request = {
            command,
            requester: user,
            time: Date.now(),
        }
        // console.log('request create unit', request)
        unitRequests.addClientCommand(request)
    })
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
            console.log('user disconnected', user.username)
            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});
