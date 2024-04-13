const { v4: uuidv4 } = require('uuid');
const { defaultViewport } = require('../constants/viewport.js');

const randomPositionInViewport = () => {
    return {
        x: Math.floor(Math.random() * defaultViewport.width),
        y: Math.floor(Math.random() * defaultViewport.height),
        dir: Math.floor(Math.random() * 6.28),
        speed: 0.5
    }
}

const makeBullet = () => ({
    id: uuidv4(),
    owner: 'server',
    maxAge: 1_000,
    type: 'BULLET',
    pos: randomPositionInViewport()
})

module.exports = {
    makeBullet,
    randomPositionInViewport
}
