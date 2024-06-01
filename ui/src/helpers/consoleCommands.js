import unitDictionary from '../generators/unitDictionary';

const DEBUG = false;

const commands = {
    build: {
        hasPermission: (command, context, user) => true,
        action: (command, context, user) => {
            const { console, ui } = context;
            const cmdParts = command.toLowerCase().split(' ')
            if (cmdParts.length < 2) {
                console.log('build command requires a unit type to build, or help to see available units');
                return;
            }
            if (cmdParts[1].toLowerCase() === 'help') {
                console.log(`available units to build: ${Object.keys(unitDictionary).join(', ')}`);
                // nction toLowerCase() { [native code] }, function toLowerCase() { [native code] }, function toLowerCase() { [native code] }, function toLowerCase() { [native code] }, function toLowerCase() { [native code] }, function toLowerCase() { [native code] }

                return;
            }
            if (Object.keys(unitDictionary).map(x=>x.toLowerCase()).includes( cmdParts[1].toLowerCase())) {
                console.log(`setting click action to: building ${cmdParts[1]}...`);
                ui.setClickAction(({
                    layer,
                    worldCoordinates,
                    requestCreateUnit
                }) => {
                    console.log(`building ${cmdParts[1]}...`);
                    const unitGenerator = unitDictionary[cmdParts[1].toUpperCase()];
                    window.console.log({unitGenerator})
                    requestCreateUnit({
                        ...unitGenerator(),
                        pos: {
                          ...worldCoordinates,
                          dir: Math.PI/2,
                          speed: 0
                        }
                    });
                });
                return;
            }
            console.log(`unrecognized unit type: ${cmdParts[1]}`);
        }
    }
}

const getUIAction = (command, context, user) => {
    const { console } = context;
    const cmdParts = command.toLowerCase().split(' ');
    const cmd = cmdParts[0];
    
    if (!commands[cmd]) {
        if (DEBUG) console.log(`command not found: ${cmd}`);
        return false;
    }

    if (!commands[cmd].action) {
        if (DEBUG) console.log(`no action for command: ${cmd}`)
        return false;
    }

    if (commands[cmd].hasPermission(command, context, user)) {
        if (DEBUG) console.log(`you have permission to execute command ${cmd}`);
        return commands[cmd];
    } else {
        if (DEBUG) console.log(`you do not have permission to execute command ${cmd}`);
    }

    return false
}

export const handleConsoleCommand = (command, context, user, passCommandToServer) => {
    const { console } = context;
    const uiAction = getUIAction(command, context, user);
    if (!uiAction) {
        if (DEBUG) console.log(`passing command to server: ${command}`)
        return passCommandToServer(command, context, user);
    }
    if (DEBUG) console.log(`executing command: ${command}`)
    return uiAction.action(command, context, user);
}
