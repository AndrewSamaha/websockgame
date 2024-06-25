import React, { useState, useContext } from "react";
import { globalStore } from "../../state/globalStore";
import { Link } from "react-router-dom";
import { SocketContext } from "../SocketProvider/SocketProvider";
import { GAME_NAME } from "../../constants/game";
import HexagonColorPicker from "./HexagonColorPicker/HexagonColorPicker";
import "./LandingPage.css";

export const LandingPage = () => {
    globalStore.user.use();
    const [inputUserName, setInputUsername] = useState('');
    const { socket, requestCreateUnit, connectToServer } = useContext(SocketContext);

    const user = globalStore.user.get();
    const { username, loggedIn, id } = user;


    const handleLogin = () => {
        console.log(`Logging in with username: ${inputUserName}`);
        globalStore.user.loggedIn.set(true);
        globalStore.user.username.set(inputUserName);
        connectToServer();
    };

    if (loggedIn) {
        return (
            <div>
                <h1>Welcome, {username}</h1>
                <Link to="/game">Play Game</Link>
            </div>
        );
    }
    const availableColors = [
        '#ff0000',
        '#ff8000',
        '#ffff00',
        '#00ff00',
        '#00bfff',
        '#4000ff',
        '#00ffff',
        '#ff00ff',
    ];
    
    return (
        <div style={{height: 'auto'}}>
            <h1>{GAME_NAME}</h1>
            <input 
                type="text" 
                placeholder="Enter username" 
                value={inputUserName} 
                onChange={(e) => setInputUsername(e.target.value)} 
            />
            <h3>Choose a color:</h3>
            <HexagonColorPicker colors={availableColors} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};
