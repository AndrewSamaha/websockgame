const { defaultViewport } = require('../constants/viewport.js');
const { worldDimensions } = require('../constants/world.js');

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

const randomPositionInWorld = () => {
    const x = Math.random() * (worldDimensions.x.max - worldDimensions.x.min) + worldDimensions.x.min;
    const y = Math.random() * (worldDimensions.y.max - worldDimensions.y.min) + worldDimensions.y.min;
    return {
        x,
        y,
        dir: 0,
        speed: 0
    }
}

const startingResourceAmount = () => {
    return {
        ore: 10_000
    }
}

module.exports = {
    randomPositionInViewport,
    randomPositionInWorld,
    randomSpeed,
    startingResourceAmount
}