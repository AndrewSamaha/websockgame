import React, { useState, useContext, useEffect } from "react";
import { globalStore } from "../../state/globalStore";
import { Link } from "react-router-dom";
import { SocketContext } from "../SocketProvider/SocketProvider";
import { GAME_NAME } from "../../constants/game";
import HexagonColorPicker from "./HexagonColorPicker/HexagonColorPicker";
import "./LandingPage.css";

export const LandingPage = () => {
    globalStore.user.use();
    const [inputUserName, setInputUsername] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [loginEnabled, setLoginEnabled] = useState(false);

    const { socket, requestCreateUnit, connectToServer } = useContext(SocketContext);
    useEffect(() => {
        if (inputUserName.length > 0 && selectedColor.length > 0) {
            setLoginEnabled(true);
        } else {
            setLoginEnabled(false);
        }
    }, [inputUserName, selectedColor]);

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

    const buttonStyle = {
        backgroundColor: loginEnabled ? 'blue' : 'gray',
        color: 'white',
        cursor: loginEnabled ? 'pointer' : 'not-allowed',
        opacity: loginEnabled ? 1 : 0.5,
    };

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
            <HexagonColorPicker setSelectedColor={setSelectedColor} />
            <button onClick={handleLogin} disabled={!loginEnabled} style={buttonStyle} >Login</button>
        </div>
    );
};
