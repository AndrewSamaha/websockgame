const { v4: uuidv4 } = require('uuid');
const ClientCommand = require('./ClientCommand');
const UnitRequest = require('./UnitRequest');

class UnitRequests {
  constructor({ io, unitState, userList }) {
    this.requests = [];
    this.io = io;
    this.unitState = unitState;
    this.userList = userList;
  }

  // refactor addRequest to use the UnitRequest class
  addRequest(receivedRequest, receivedTime = Date.now()) {
    const request = {
        requester: receivedRequest.requester,
        timeReceivedByServer: receivedTime,
        idServer: uuidv4(),
        ...receivedRequest,
    };
    this.requests.push(new UnitRequest(request));
  }

  addClientCommand(receivedRequest, receivedTime = Date.now()) {
    const request = {
        requester: receivedRequest.requester,
        timeReceivedByServer: receivedTime,
        idServer: uuidv4(),
        ...receivedRequest,
    };
    this.requests.push(new ClientCommand(request));
  }

  removeRequest(request) {
    this.requests = this.requests.filter(r => r.id !== request.id);
  }

  getRequestById(id) {
    return this.requests.find(r => r.id === id);
  }

  getOneRequest() {
    return this.requests[0];
  }

  popRequest() {
    return this.requests.shift();
  }

  pushRequest(request) {
    this.requests.unshift(request);
  }

  processRequests({ io, limit }) {
    let i = 0;
    this.requests.forEach(r => {
        if (limit && i > limit) return;

        const request = this.popRequest();
        request.doRequest({ io, unitState: this.unitState, userList: this.userList });
    });
  }
}

module.exports = UnitRequests;