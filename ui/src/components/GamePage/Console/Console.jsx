import React, { useState, useEffect, useRef, useContext } from 'react';
import { SocketContext } from '../../SocketProvider/SocketProvider';
import { globalStore } from '../../../state/globalStore';
import { handleConsoleCommand } from '../../../helpers/consoleCommands';
import { GAME_SIZE } from '../../../constants/game';
const terminalHeight = 150;

const TextLine = ({ children }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '1.2em',
            margin: '0',
            padding: '0',
            overflow: 'hidden',
        }}>
            {children}
        </div>
    )
}

export const Console = (props) => {
    globalStore.console.buffer.use();

    const { sendUserCommand } = useContext(SocketContext);
    const endRef = useRef(null);

    const handleInput = (input) => {
        globalStore.console.log(`> ${input}`);
        handleConsoleCommand(input, globalStore, globalStore.user, () => sendUserCommand(input));
    };

    return (
        <div className="container"
            style={{
                marginTop: '5px',
                padding: '5px',
                backgroundColor: 'black',
                color: 'white',
                width: `${GAME_SIZE.width-10}px`,
                height: `${terminalHeight}px`,
                display: 'inline-block',
                overflow: 'auto',
            }}
        >
            { globalStore.console.buffer.map((line, index) => (<TextLine key={index}>{line}</TextLine>))}
            <input 
                id={'TerminalInput'}
                style={{
                    border: 'none',
                    borderStyle: 'none',
                    outline: 'none',
                    marginTop: '5px',
                    marginLeft: '0px',
                    paddingLeft: '0px',
                    width: '98%',
                }}
                autoComplete='off'
                ref={endRef}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault(); // prevent the form from being submitted
                        handleInput(event.target.value);
                        event.target.value = ''; // clear the input field
                    } 
                }}/>
            
            
        </div>
    )
};