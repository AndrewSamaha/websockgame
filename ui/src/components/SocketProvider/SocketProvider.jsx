// add the socket to the context
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';
// add imports for createContext
import { createContext } from 'react';

const createInitialSocketState = () => {

    const socket = io('http://localhost:3000');

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
        socket
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

