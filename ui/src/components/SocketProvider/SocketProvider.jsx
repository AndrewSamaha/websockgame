// add the socket to the context
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';
// add imports for createContext
import { createContext } from 'react';

import { globalStore } from '../../state/globalStore';
import { addChar, upsertChars, truncAndInsertChars } from '../../state/chars';
import { makeBullet } from '../../generators/units';
import unitDictionary from '../../generators/unitDictionary';

const createInitialSocketState = () => {

    const socket = io('http://localhost:3000', { autoConnect: false});

    socket.on('authenticate yourself', () => {
        console.log('received authentication request from server');
        const user = globalStore.user.get();
        console.log('heres what we have in the globalStore user')
        console.log(user)
        console.log('logging in with username:', user.username)
        socket.emit('login', user.username);
    });

    socket.on('loginSuccessful', (data) => {
        console.log('login successful', data);
        globalStore.user.id.set(data.id);
        if (data.resources) {
            globalStore.user.resources.set(data.resources);
        }
        console.log({globalstoreuser: globalStore.user.get()})
    });

    socket.on('resource update', (data) => {
        console.log('resource update', data);
        globalStore.user.resources.set(data);
    });
    
    socket.on('login', (data) => {
        console.log('login', data);
    // globalStore.user.set(data);
    });


    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', (data) => {
        console.log(`${data.username} joined`);
    });

    // Whenever the server emits 'user left', console.log it in the chat body
    socket.on('user left', (data) => {
        console.log(`${data.username} left`);
    });

    // Whenever the server emits 'typing', show the typing message
    // socket.on('typing', (data) => {
    //   console.log('typing', data)
    // });

    socket.on('new message', (data) => {
        console.log('new message', data)
    });

    socket.on('new unit', (data) => {
        //console.log('new unit', data)
        const A = makeBullet();
        A.pos = data.data.pos;
        // console.log(A)
        addChar('interactive', A, globalStore);
    });

    socket.on('new unit v2', (data) => {
        //console.log('new unit v2', data)
        if (!unitDictionary[data.type]) {
            console.log(`ERROR: new unit v2; received unknown unit type ${data.type}`)
            return;
        }
        const newUnit = unitDictionary[data.type](data);
        // console.log(`new unit v2; adding received unit type ${data.type}`)
        addChar('interactive', newUnit, globalStore);
    });

    socket.on('unitState', (data) => {
        const { broadcastId, timeServer, units, age } = data;
        const timeClient = Date.now();
        const timeClientServerDiff = timeClient - timeServer;

        // console.log(`unitState broadcastId: ${broadcastId}`)
        // console.log(`time-server diff: ${timeClientServerDiff} ms`)
        // console.log(`Upserting ${units.length} units`)
        const newUnits = units.map(unit => {
            const newUnit = unitDictionary[unit.type](unit);
            return newUnit;
        })
        upsertChars('interactive', newUnits, globalStore);
        // truncAndInsertChars('interactive', newUnits, globalStore);
    })

    // Whenever the server emits 'stop typing', kill the typing message
    // socket.on('stop typing', (data) => {
    //   console.log('stop typing', data);
    // });

    socket.on('disconnect', () => {
        console.log('you have been disconnected');
    });

    socket.io.on('reconnect', () => {
        console.log('you have been reconnected');
        if (1) {
            socket.emit('add user', 'gamer');
        }
    });

    socket.io.on('reconnect_error', () => {
        console.log('attempt to reconnect has failed');
    });

    return {
        socket,
        requestCreateUnit: (unit) => {
            socket.emit('request create unit', {
                ...unit,
                timeCreateUnitRequest: Date.now()
            });
        },
        connectToServer: () => {
            const user = globalStore.user.get();
            console.log('heres what we have in the globalStore user')
            console.log(user)
            socket.connect();
        },
        sendUserCommand: (command) => {
            socket.emit('user command', command);
        }
    };
}
// create SocketContext and pass it an initial value of createInitialSocketState
export const SocketContext = createContext(createInitialSocketState);


export const SocketProvider = ({ children }) => {
    const socketState = useMemo(createInitialSocketState, []);
    return (
        <SocketContext.Provider value={socketState}>
            {children}
        </SocketContext.Provider>
    );
};



SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

