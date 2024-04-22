import React, { useEffect, useContext } from "react";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { Layer } from "../Layer/Layer";
import { GAME_SIZE } from "../../constants/game";
import { VIEWPORT_KEYS } from "../../constants/input";
import { useAnimationFrame } from "@haensl/react-hooks";
import { globalStore } from "../../state/globalStore";
import { SocketContext } from "../SocketProvider/SocketProvider"; // Import the SocketContext

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
        const handleKeyDown = (e) => VIEWPORT_KEYS.includes(e.code) && !e.repeat ? globalStore.viewport.input[e.code].set(Date.now) : 0;
        const handleKeyUp = (e) => VIEWPORT_KEYS.includes(e.code) && !e.repeat ? globalStore.viewport.input[e.code].set(0) : 0;
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
        <>
            <Layer zIndex={layer.zIndex} clickable={layer.clickable} mapParams={mapParams}/>
        </>
    );
};
