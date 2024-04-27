const { v4: uuidv4 } = require('uuid');

class UnitRequest {
  constructor(request) {
    this.request = request;
  }
  doRequest({ io, unitState }) {
    const { id, type, pos } = this.request.data;
    const requesterName = this.request.requester.username;
    //console.log(`  ${Math.floor(Date.now()/1000)}: Doing unit request by ${requesterName}: ${type} at ${pos.x} ${pos.y}`)
    const unitData = {
        ...this.request.data,
        owner: {
          username: this.request.requester.username,
          id: this.request.requester.id
        }
    }
    //console.log(unitData)
    if (io) io.emit('new unit v2', unitData)
    if (unitState) {
        unitState.addUnit(unitData);
    }
  }
}

class UnitRequests {
  constructor({ io, unitState }) {
    this.requests = [];
    this.io = io;
    this.unitState = unitState;
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

  processRequests({ io, limit, unitState }) {
    let i = 0;
    this.requests.forEach(r => {
        if (limit && i > limit) return;

        const request = this.popRequest();
        request.doRequest({ io, unitState: this.unitState });
    });
  }
}

module.exports = UnitRequests;