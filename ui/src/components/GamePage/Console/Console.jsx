import React, { useState, useEffect, useRef } from 'react';
import { GAME_SIZE } from '../../../constants/game';
const containerHeight = 20;
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
  const [terminalLineData, setTerminalLineData] = useState([
    <TextLine key={'initialinput1'} >Here is some output</TextLine>,
    <TextLine key={'initialinput2'} >Here is some more output</TextLine>
  ]);
  const endRef = useRef(null);

  const handleInput = (input) => {
    const key = `input${Math.floor(Math.random()*10000)}`;
    setTerminalLineData([
      ...terminalLineData,
      <TextLine key={key}>{input}</TextLine>
    ]);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLineData]);

  return (
    <div className="container"
    style={{
        marginTop: '5px',
        padding: '5px',
        backgroundColor: 'black',
        color: 'white',
        width: `${GAME_SIZE.width}px`,
        height: `${terminalHeight}px`,
        display: 'inline-block',
        overflow: 'auto',
      }}
    >
        { terminalLineData }
        <input 
            id={'TerminalInput'}
            style={{
                border: 'none',
                borderStyle: 'none',
                // backgroundColor: 'darkgray',
                outline: 'none',
                marginTop: '5px',
                marginLeft: '0px',
                paddingLeft: '0px',
                width: '98%',
            }}
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