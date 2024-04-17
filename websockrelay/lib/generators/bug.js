const { v4: uuidv4 } = require('uuid');
const { defaultViewport } = require('../constants/viewport.js');

const randomSpeed = () => Math.random() * 0.2 + 0.05;
const randomPositionInViewport = () => {
    const y = Math.floor(Math.random() * defaultViewport.height);
    if (Math.random() > 0.5) return {
        x: 0,
        y,
        dir: Math.PI,
        speed: randomSpeed()
    }
    return {
        x: Math.floor(defaultViewport.width),
        y,
        dir: 0,
        speed: randomSpeed()
    }
}

const makeBug = () => ({
    id: uuidv4(),
    owner: 'server',
    maxAge: 3_500,
    type: 'BUG',
    pos: randomPositionInViewport()
})

module.exports = {
    makeBug
}