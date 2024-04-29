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

function App() {
  return (
    <Router>
      <div id={"router"}>
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
