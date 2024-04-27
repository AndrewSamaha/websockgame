const { defaultViewport } = require('./viewport.js');

const worldDimensions = {
    x: {
        min: -defaultViewport.width,
        max: defaultViewport.width
    },
    y: {
        min: -defaultViewport.height,
        max: defaultViewport.height
    }
}

module.exports = {
    worldDimensions
};
