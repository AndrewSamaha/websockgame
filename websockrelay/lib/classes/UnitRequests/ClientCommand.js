const UnitRequest = require('./UnitRequest');

// create class ClientCommand that inherits from UnitRequest
class ClientCommand extends UnitRequest {
    commands = {
        'help': {
            description: 'show help',
            action: (context, request) => {
                return Object.entries(this.commands).map(([key, val]) => `${key}`).join(', ');
            }
        },
        'give': {
            description: 'give yourself resources to another player',
            action: (context, request) => {
                const { io, unitState, userList } = context;
                const { requester, data, command } = request;
                const commandArray = command.split(' ');
                if (commandArray.length <= 2 || commandArray.length > 4) {
                    return 'Usage: give <amount> <resource> [target]';
                }
                let targetUser = null;
                if (commandArray.length === 4) {
                    targetUser = userList.getUserByName(commandArray[3]);
                } else {
                    targetUser = userList.getUserById(request.requester.id);
                }
                if (!targetUser) {
                    return `target user not found!`;
                }
                const amount = parseInt(commandArray[1]);
                if (!amount) {
                    return `amount must be a number greater than 0!`;
                }
                const resource = commandArray[2];
                if (!Object.keys(targetUser.resources).includes(resource)) {
                    return `resource must be one of: ${Object.keys(targetUser.resources).join(', ')}`;
                }
                const { resources } = targetUser;
                targetUser.resources[resource] += amount;
                return `gave ${amount} ${resource} to ${targetUser.username}!`;
            }
        },
        who: {
            description: 'show who is online',
            action: (context, request) => {
                const { userList } = context;
                return userList.users.map(u => u.username).join(', ');
            }
        }
    }
    
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
        let response = `command not found: ${command}`;
        const searchKey = command.split(' ')[0]?.toLowerCase();
        if (this.commands[searchKey]) {
            response = this.commands[searchKey].action(context, this.request);
        }

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

module.exports = ClientCommand;