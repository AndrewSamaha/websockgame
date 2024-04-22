import React from 'react';
import PropTypes from 'prop-types';
import { observer } from "@legendapp/state/react"

import { worldXtoScreenX, worldYtoScreenY } from '../../../helpers/viewport';
import { globalStore } from '../../../state/globalStore';
import { ZINDEX } from '../../../constants/zindex';

const ColorBubble = ({ children, char }) => {
  const { type } = char;
  const bubbleOpacity = 0.2;
  const bubbleSize = 20;
  const top = -bubbleSize/6;
  const left = -bubbleSize/3;
  const GREEN = `rgba(0, 255, 0, ${bubbleOpacity})`;
  const RED = `rgba(255, 0, 0, ${bubbleOpacity})`;
  const BLUE = `rgba(0, 0, 255, ${bubbleOpacity})`;

  const getColor = (type) => {
    switch (type) {
      case 'TOWER':
      case 'BULLET':
        // return rgba(0, 0, 255, 0.5)
        return GREEN;
        //return 'blue';
      case 'BUG':
        return RED;
      default:
        return 'black';
    }
  }
  
  return (
    <div style={{
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      backgroundColor: getColor(type),
      // set opacity of background color to 20%
      // opacity: '0.5',
      width: `${bubbleSize}px`,
      height: `${bubbleSize}px`,
      borderRadius: '50%',
      zIndex: ZINDEX.charBubble,
    }}>
      {children}
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

  return (
    <div 
      style={{
        zIndex: 'inherit',
        position: 'absolute',
        left: `${worldXtoScreenX(x, viewport.pos.x.peek())}px`,
        top: `${worldYtoScreenY(y, viewport.pos.y.peek())}px`,
        transform: `rotate(${dir+3.142*1.5}rad)`,
        color: 'white'}}>
        {(TYPES_THAT_GET_BUBBLES.includes(type)) && <ColorBubble char={char} />}
        <div
          style={{
            zIndex: ZINDEX.charRepresentation,
          }}>
          {representation}
        </div>
    </div>
  )
});

Char.propTypes = {
  charData: PropTypes.object,
}