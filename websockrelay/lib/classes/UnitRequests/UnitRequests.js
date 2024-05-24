const { v4: uuidv4 } = require('uuid');

const lookupUnitCost = (unitData) => {
  const cost = {
    ore: 0,
    gold: 0,
    wood: 0
  }
  switch (unitData.type) {
    case 'TOWER':
      cost.ore = 10;
      cost.gold = 2;
      cost.wood = 10;
      break;
  }
  if (unitData.type === 'BULLET') return cost;

  console.log(`estimated cost of unit type ${unitData.type}: ${JSON.stringify(cost)}`)
  return cost;
}

const chargeUserForUnit = (user, unitData) => {
  if (unitData.type === 'BULLET') return true;
  if (!user) {
    console.log(`  the user is null, cannot charge for unit`)
    return true;
  }
  const cost = lookupUnitCost(unitData);
  const resources = { ...user.resources };
  resources.ore -= cost.ore;
  resources.gold -= cost.gold;
  resources.wood -= cost.wood;
  const afforable = Object.entries(resources).every(([key, value]) => value >= 0);
  if (!afforable) {
    return false;
  }
  user.resources = resources;
  console.log(`  charged user for unit: ${JSON.stringify(cost)}`)
  console.log(`  current user.resources=${JSON.stringify(user.resources)}`)
  return true;
}

class UnitRequest {
  constructor(request) {
    this.request = request;
  }
  doRequest({ io, unitState, userList }) {
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
    if (unitData.type !== 'BULLET') {
      console.log(unitData)
    }

    if (!unitState) {
      console.log(`this request has no unitState passed to doRequest, doing nothing.`)
      return;
    }
    
    const user = userList.getUserById(this.request.requester.id);
    
    if (!chargeUserForUnit(user, unitData)) {
        console.log('not enough resources to build unit');
        console.log(`userResources: ${JSON.stringify(user.resources)}`)
        return;
    }

    if (io) {
      io.emit('new unit v2', unitData);
      if (user) io.emit('resource update', user.resources);
    }
    unitState.addUnit(unitData);
  }
}

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