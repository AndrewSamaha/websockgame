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
import { GAME_NAME } from './constants/game';
import './App.css'


enableReactUse();

function App() {
  useEffect(() => {
    document.title = GAME_NAME;
  }, []);

  return (
    <Router>
      <div id={"router"}>
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
