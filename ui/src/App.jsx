import React, { useEffect, useContext } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { enableReactUse } from '@legendapp/state/config/enableReactUse';
import { LandingPage } from './components/LandingPage/LandingPage';
import { GamePage } from './components/GamePage/GamePage';
import './App.css'


enableReactUse();

// function OgApp() {
//   const { socket, requestCreateUnit } = useContext(SocketContext);

//   useEffect(() => {
//     const handleKeyDown = (e) => VIEWPORT_KEYS.includes(e.code) && !e.repeat ? globalStore.viewport.input[e.code].set(Date.now) : 0;
//     const handleKeyUp = (e) => VIEWPORT_KEYS.includes(e.code) && !e.repeat ? globalStore.viewport.input[e.code].set(0) : 0;
//     document.addEventListener('keydown', handleKeyDown);
//     document.addEventListener('keyup', handleKeyUp);
//   }, []);

//   useAnimationFrame((delta) => {
//     (() => {
//       // apply friction to speed
//       globalStore.viewport.pos.speed.set((speed) => Math.abs(speed) < MIN_VIEWPORT_SPEED ? 0 : speed*VIEWPORT_FRICTION);

//       globalStore.viewport.convertKeysToForce(Date.now());
//       if (globalStore.viewport.force.peek().lengthSq() < .01) {
//         //console.log('force too small', globalStore.viewport.force.peek(), globalStore.viewport.pos.x.peek())
//         return;
//       }
//       // convert forces to translation
//       globalStore.viewport.moveViewport(delta);
//     })();

//     Object.entries(globalStore.interactive.dict.peek()).map(([id, char]) => {
//       const { animate } = char;
//       if (animate) animate(delta, globalStore.viewport, globalStore, 'interactive', mapParams, id, requestCreateUnit)
//     })

//     Object.entries(globalStore.independent.dict.peek()).map(([id, char]) => {
//       const { animate } = char;
//       if (animate) animate(delta, globalStore.viewport, globalStore, 'independent', mapParams, id)
//     })

//   })

//   return (
    
//     <>
//         <Layer zIndex={layer.zIndex} clickable={layer.clickable} mapParams={mapParams}/>
//     </>
//   )
// }

function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route exact path="/" element={<LandingPage/>} />
          <Route exact path="/game" element={<GamePage/>} />
          <Route path="*" element={<LandingPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
