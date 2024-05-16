import React from 'react';
import { observer } from "@legendapp/state/react"
import { globalStore } from '../../../state/globalStore';
import { BACKGROUND_TILE_SIZE } from '../../../constants/backgroundtiles';
import { BackgroundTile } from './BackgroundTile/BackgroundTile';

export const Background = observer(({ id, viewport }) => {
    const backgroundTiles = globalStore.backgroundTiles.get();
  
    return (
        <div
            style={{ 
            position: 'absolute',
            boxSizing: 'border-box',
            margin: '0',
            padding: '0',
            height: `${BACKGROUND_TILE_SIZE.height}px`,
            width: `${BACKGROUND_TILE_SIZE.width}px`,
            left: `${-viewport.pos.x.get()}px`,
            top: `${-viewport.pos.y.get()}px`,
            zIndex: 0,
            }}>
            {backgroundTiles.map((tile) => {
              return (
                <BackgroundTile key={`${tile.id}`} viewport={viewport} tile={tile} />
              )
            })}
        </div>
    );
  });
