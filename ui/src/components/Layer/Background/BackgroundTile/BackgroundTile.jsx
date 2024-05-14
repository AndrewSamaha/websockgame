import React from 'react';
import { observer } from "@legendapp/state/react"
import { BACKGROUND_TILE_SIZE } from '../../../../constants/backgroundtiles';

export const BackgroundTile = observer(({ id, viewport, tile }) => {
    if (!tile) // handle the situation when char is null (it's been deleted)
      return (<div style={{display: 'none'}} />)
  
    const { pos } = tile;
    const { x, y } = pos; 
  
    const darkgrayrgba = 'rgba(169,169,169,0.3)';
    return (
        <pre style={{ 
            zIndex: 0,
            position: 'absolute',
            boxSizing: 'border-box',
            color: darkgrayrgba,
            margin: '0',
            padding: '0',
            height: `${BACKGROUND_TILE_SIZE.height}px`,
            width: `${BACKGROUND_TILE_SIZE.width}px`,
            left: `${x}px`,
            top: `${y}px`
            }}>
            {tile.asciiArt}
        </pre>
    );
  });
  