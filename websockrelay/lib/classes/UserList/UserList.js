const { v4: uuidv4 } = require('uuid');

// create a class to represent each connected user
class User {
  constructor(socket) {
    this.socket = socket;
    if (!socket) {
      console.log('  User.constructor: socket is null! a Socket required to create a user')
    }
    this.id = uuidv4();
    this.requests = [];
  }

  setUserName(username) {
    this.username = username;
  }

  loadState() {
    this.resources = {
      ore: 100,
      gold: 100,
      wood: 100
    }
  }

  toJson() {
    return {
      username: this.username,
      id: this.id,
      resources: this.resources
    }
  }
}
  
// create a class to manage all connected users
class UserList {
  constructor() {
    this.users= []
    this.outstandingRequests = []
  }

  addUser(user) {
    this.users.push(user)
  }

  removeUser(user) {
    this.users = this.users.filter(u => u.id !== user.id)
  }

  createNewUser(socket) {
    const user = new User(socket);
    this.addUser(user);
    return user;
  }

  addNewRequest(request) {
    this.outstandingRequests.push(request)
  }

  doRequestQueue(tLimit) {
    const startTime = Date.now()
    const requests = this.outstandingRequests.filter(r => r.timestamp < now - tLimit)
    this.outstandingRequests = this.outstandingRequests.filter(r => r.timestamp >= now - tLimit)
    requests.forEach(r => {
      io.emit('create unit', r)
    })
    for (let i = 0; i < this.outstandingRequests.length && Date.now() < startTime + tlimit; i++) {
      const r = requests[i]
      console.log('create unit', r)
    }
  }

  // get an active user
  getUserById(id) {
    return this.users.find(u => u.id === id)
  }

  getUserByName(username) {
    return this.users.find(u => u.username === username)
  }

  // get one active user
  getOneActiveUser() {
    return this.users[0]
  };

  broadcast(event, data) {
    if (this.users.length === 0) return;
    this.users[0].socket.broadcast.emit(event, data);
  }

}

// export UserList class
module.exports = UserList
