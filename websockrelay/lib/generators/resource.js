const { v4: uuidv4 } = require('uuid');
const { randomPositionInWorld, startingResourceAmount } = require('../helpers/generator.js');


const makeResource = (resources) => ({
    id: uuidv4(),
    owner: 'server',
    maxAge: 0,
    type: 'RESOURCE',
    pos: {
        ...randomPositionInWorld(),
        dir: Math.PI/2
    },
    resources: {
        ...startingResourceAmount(),
        ...resources
    }
})

module.exports = {
    makeResource
}