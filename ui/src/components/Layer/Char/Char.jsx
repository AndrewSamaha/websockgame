import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from "@legendapp/state/react"

import { worldXtoScreenX, worldYtoScreenY } from '../../../helpers/viewport';
import { globalStore } from '../../../state/globalStore';
import { ZINDEX } from '../../../constants/zindex';
import { styles  } from '../../../styles/styles';

const CHAR_SIZE = 20;

const intToHex = (i) => {
    const hex = i.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}

const ColorBubble = ({ children, char }) => {
  
    const belongsToPlayer = char.owner.id === globalStore.user.id.get();
    const [hover, setHover] = useState(false);

    const { type } = char;
    const bubbleOpacity = intToHex(0.2 * 255);
    const bubbleSize = CHAR_SIZE;
    const top = -bubbleSize/2;
    const left = -bubbleSize/2;
    const GREEN = `rgba(0, 255, 0, ${bubbleOpacity})`;
    const RED = `rgba(255, 0, 0, ${bubbleOpacity})`;
    const BLUE = `rgba(0, 0, 255, ${bubbleOpacity})`;

    const getColor = (type) => {
        if (char.owner.username === 'server') return '';
        return `${char.owner.color}${bubbleOpacity}` || 'pink';
    }
  
    return (
        <div style={{
            //position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            backgroundColor: getColor(type),
            borderColor: hover ? styles.ui.callToAction.hex : 'black',
            borderStyle: hover ? 'solid' : 'none',
            width: `${bubbleSize}px`,
            height: `${bubbleSize*2}px`,
            borderRadius: '50%',
            position: 'relative',
            transition: 'transform 0.3s ease',
        }}
        onMouseEnter={() => char.hoverable ? setHover(true) && globalStore.ui.setHoveredChar(char) : null}
        onMouseLeave={() => setHover(false)}
        onMouseDown={(e) => {
            globalStore.ui.setSelectedChar(char);
            console.log('selected char', char);
            e.stopPropagation();
        }}
        >
            {char.representation}
        </div>
    )
}

const TYPES_THAT_GET_BUBBLES = ['TOWER', 'BUG'];

export const Char = observer(({ id, viewport }) => {
    const char = globalStore.interactive.dict[id].get();
    globalStore.interactive.dict[id].pos.use(); //get();
    if (!char) // handle the situation when char is null (it's been deleted)
        return (<div style={{display: 'none'}} />)

    const { pos, representation, type } = char;
    const { x, y, dir } = pos; 

    if (!viewport) return (
        <div
            style={{
                zIndex: 'inherit',
                // display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // 
                height: '1em',
                fontSize: '4em',
                //transform: `rotate(${dir+3.142*1.5}rad)`,
                color: 'white'}}>
            {char.representation}
        </div>
    )

    return (
        <div
            style={{
                zIndex: 'inherit',
                position: 'absolute', // absolute
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: `${CHAR_SIZE}px`,
                width: `${CHAR_SIZE}px`,
                left: `${worldXtoScreenX(x, viewport.pos.x.peek())}px`,
                top: `${worldYtoScreenY(y, viewport.pos.y.peek())}px`,
                transform: `rotate(${dir+3.142*1.5}rad)`,
                color: 'white'}}>
            <ColorBubble char={char}/>
        </div>
    )
});

Char.propTypes = {
    charData: PropTypes.object,
}