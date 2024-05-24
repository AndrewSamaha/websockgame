import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Char } from './Char/Char';
import { observer } from "@legendapp/state/react"
import { addChar } from '../../state/chars';
import { makeBug, makeTower } from '../../generators/units';
import { Frag } from './Explosion/Frag/Frag';
import { mouseEventToWorldCoordinates } from '../../helpers/viewport';
import { globalStore } from '../../state/globalStore';
import { CHARTYPES } from '../../generators/units';
import { SocketContext } from '../SocketProvider/SocketProvider';
import { Background } from './Background/Background';

const layerPadding = 10;

const PEEK = false;
const getter = PEEK ? 'peek' : 'get';

export const Layer = observer(({ zIndex=0, mapParams }) => {
  globalStore.viewport.use();
  const viewport = globalStore.viewport;
  const interactiveIdArray = globalStore.interactive.idArray[getter]();
  const independentCharArray = Object.values(globalStore.independent.dict[getter]());
  // Access the socket from the Socket context
  const { socket, requestCreateUnit } = useContext(SocketContext);

  const charMapParams = {
    width: mapParams.width - layerPadding * 2,
    height: mapParams.height - layerPadding * 2
  }
  
  return (
    <div
      id={"layer"}
      onMouseDown={(e) => {
        const layer = document.getElementById('layer');

        requestCreateUnit({
            ...makeTower(),
            pos: {
              ...mouseEventToWorldCoordinates(e, layer, viewport.pos.x.peek(), viewport.pos.y.peek()),
              dir: Math.PI/2,
              speed: 0
            }
        });
        
      }}
  
      style={{
        position: 'relative',
        zIndex: zIndex,
        backgroundColor: 'black', 
        border: '2px',
        borderColor: 'black',
        boxSizing: 'border-box',
        width: `${mapParams.width}px`,
        height: `${mapParams.height}px`,
        padding: `${layerPadding}px`,
        margin: '0',
        overflow: 'hidden'
        }}>
          <Background viewport={viewport} />
          
          {
            
            independentCharArray.map((char) => {
              if (char.type === CHARTYPES.FRAG) {
                return (<Frag
                    key={`${char.id}`}
                    id={char.id}
                    mapParams={charMapParams}
                    storeName={'independent'}
                    viewport={viewport}
                  />)
              } else {
                return (  
                  <Char
                    key={`${char.id}`}
                    id={char.id}
                    mapParams={charMapParams}
                    storeName={'independent'}
                    viewport={viewport}
                  />
                
                )
              }
            })
          }
          
          {
              interactiveIdArray.map((charId) => {
                return (                  
                    <Char
                      key={`${charId}`}
                      id={charId}
                      mapParams={charMapParams}
                      storeName={'interactive'}
                      viewport={viewport}
                    />
                  
              )})
          }

          
    </div>
  )
});

Layer.propTypes = {
  zIndex: PropTypes.number.isRequired,
  clickable: PropTypes.bool.isRequired,
  mapParams: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
}