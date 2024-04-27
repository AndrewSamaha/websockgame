const { v4: uuidv4 } = require('uuid');
const { randomPositionInViewport } = require('../helpers/generator.js');


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