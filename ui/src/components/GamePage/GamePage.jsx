import React, { useEffect, useContext } from "react";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { Layer } from "../Layer/Layer";
import { GAME_SIZE } from "../../constants/game";
import { VIEWPORT_KEYS } from "../../constants/input";
import { useAnimationFrame } from "@haensl/react-hooks";
import { globalStore } from "../../state/globalStore";
import { SocketContext } from "../SocketProvider/SocketProvider"; // Import the SocketContext
import { GlobalStatusBar } from "./GlobalStatusBar/GlobalStatusBar";
import { Console } from "./Console/Console";
import { TopLeftCorner } from "./TopLeftCorner/TopLeftCorner";
import { LeftSideBar } from "./LeftSideBar/LeftSideBar";

import "./GamePage.css";

const layer = {
    zIndex: 0,
    clickable: false
};

const mapParams = GAME_SIZE;
const MIN_VIEWPORT_SPEED = 0.1;
const VIEWPORT_FRICTION = 0.997;

export const GamePage = () => {
    const { socket, requestCreateUnit } = useContext(SocketContext);

    useEffect(() => {
        const terminalInput = document.getElementById('TerminalInput');
        const onTerminal = () => document.activeElement === terminalInput;
        const handleKeyDown = (e) => {
          if (onTerminal()) {
            if (e.key === 'Escape') e.target.blur(); // remove focus from the input field
            return;
          }
          VIEWPORT_KEYS.includes(e.code) && !e.repeat ? globalStore.viewport.input[e.code].set(Date.now) : 0
        };
        const handleKeyUp = (e) => {
          if (onTerminal()) return;  
          if (e.code === 'Slash') {
            terminalInput.focus();
            return;
          }
          VIEWPORT_KEYS.includes(e.code) && !e.repeat ? globalStore.viewport.input[e.code].set(0) : 0
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }, []);
    
    useAnimationFrame((delta) => {
        (() => {
          // apply friction to speed
          globalStore.viewport.pos.speed.set((speed) => Math.abs(speed) < MIN_VIEWPORT_SPEED ? 0 : speed*VIEWPORT_FRICTION);
    
          globalStore.viewport.convertKeysToForce(Date.now());
          if (globalStore.viewport.force.peek().lengthSq() < .01) {
            //console.log('force too small', globalStore.viewport.force.peek(), globalStore.viewport.pos.x.peek())
            return;
          }
          // convert forces to translation
          globalStore.viewport.moveViewport(delta);
        })();
    
        Object.entries(globalStore.interactive.dict.peek()).map(([id, char]) => {
          const { animate } = char;
          if (animate) animate(delta, globalStore.viewport, globalStore, 'interactive', mapParams, id, requestCreateUnit)
        })
    
        Object.entries(globalStore.independent.dict.peek()).map(([id, char]) => {
          const { animate } = char;
          if (animate) animate(delta, globalStore.viewport, globalStore, 'independent', mapParams, id)
        })
    
      })

    return (
        <div id={"gamepage"}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            zIndex: `${layer.zIndex}`,
            width: '100%',
            alignItems: 'flex-start',
          }} >
            <div id={'leftHandColumn'}
              style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              zIndex: `${layer.zIndex}`,
              width: '128px',
              height: '668px',
              margin: '5px 0px 0px 0px',
              padding: `0px 4px 0px 0px`,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
              <TopLeftCorner />
              <LeftSideBar />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              zIndex: `${layer.zIndex}`,
              width: '800px'
            }}>
              <GlobalStatusBar />
              <Layer zIndex={layer.zIndex} clickable={layer.clickable} mapParams={mapParams}/>
              <Console />
            </div>
            
        </div>
    );
};
