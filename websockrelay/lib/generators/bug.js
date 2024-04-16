const { v4: uuidv4 } = require('uuid');
const { defaultViewport } = require('../constants/viewport.js');

const randomPositionInViewport = () => {
    const y = Math.floor(Math.random() * defaultViewport.height);
    if (Math.random() > 0.5) return {
        x: 0,
        y,
        dir: Math.PI,
        speed: 0.25
    }
    return {
        x: Math.floor(defaultViewport.width),
        y,
        dir: 0,
        speed: 0.25
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