const UnitRequest = require('./UnitRequest');

class UnitNavigation extends UnitRequest {
    
    constructor(request) {
        super(request);
    }
  
    doRequest(context) {
        const { io, unitState, userList } = context;
        const { command, requester, id, timeReceivedByServer } = this.request;
        const user = userList.getUserById(requester.id);
        
        if (!io) {
            console.log(`no client - not performing client command: ${command}`)
            return;
        }
        if (!unitState) {
            console.log(`this request has no unitState passed to doRequest, doing nothing.`)
            return;
        }
        
        // unitState.addUnit(unitData);

        const timeProcessedByServer = Date.now();
        requester.socket.emit('performed client command', {
            response,
            command,
            searchKey,
            id,
            timeReceivedByServer,
            timeProcessedByServer,
            requestLatency: (timeProcessedByServer - timeReceivedByServer)
        });
    }
  }

  module.exports = UnitNavigation;