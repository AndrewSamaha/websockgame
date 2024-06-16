const DEFAULT_RADIUS = 2;

const setNextDestination = (unit, destination) => {
    unit.navigation = {
        ...unit.navigation,
        nextDestination: {
            x: destination.x,
            y: destination.y,
            radius: destination.radius || DEFAULT_RADIUS,
            timeCreated: Date.now()
        }
    }

    setDirToNextDestination(unit);
}

const createNextDestination = (unit, delta=1_000) => {
    // check to see if we'll be within radius of the final destination in delta time
    const { x: x2, y: y2, radius } = unit.navigation.finalDestination;
    const { x: x1, y: y1 } = unit.pos;
    const speed = unit.pos.speed || unit.maxSpeed;
    // determine if we'll reach or pass the final destination in delta time
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const timeToDestination = distance / speed;
    if (timeToDestination < delta) {
        // we'll reach or pass the final destination in delta time
        setNextDestination(unit, unit.navigation.finalDestination);
        return
    }
    // set next destination to be the point on the line between the current position and the final destination in delta time
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distanceToTravel = speed * delta;
    const distanceRatio = distanceToTravel / distance;
    const nextX = x1 + dx * distanceRatio;
    const nextY = y1 + dy * distanceRatio;
    setNextDestination(unit, { x: nextX, y: nextY, radius });
}

const setFinalDestination = (unit, destination) => {
    console.log('setFinalDestination')
    console.log({unit})
    console.log({destination})
    if (unit.navigation?.nextDestination?.timeCreated < Date.now()) {
        // remove the intermediate destination if it's expired
        unit.navigation = {
            ...unit.navigation,
            nextDestination: null
        }
    }

    unit.navigation = {
        ...unit.navigation,
        finalDestination: {
            x: destination.x,
            y: destination.y,
            radius: destination.radius || DEFAULT_RADIUS,
            timeCreated: Date.now()
        }
    }

    createNextDestination(unit);
    
    console.log(JSON.stringify(unit, null, 2))
}

const setDirToNextDestination = (unit) => {
    const { x: x1, y: y1 } = unit.pos;
    const { x: x2, y: y2 } = unit.navigation.nextDestination;
    const dx = x2 - x1;
    const dy = y2 - y1;
    unit.pos.dir = Math.atan2(-dy, -dx);
}

const atNextDestination = (unit) => {
    // if (!unit.navigation?.nextDestination) return false;
    const { x: x1, y: y1 } = unit.pos;
    const { x: x2, y: y2, radius } = unit.navigation.nextDestination;
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance <= radius;
}

const atFinalDestination = (unit) => {
    // if (!unit.navigation?.finalDestination) return false;
    const { x: x1, y: y1 } = unit.pos;
    const { x: x2, y: y2, radius } = unit.navigation.finalDestination;
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance <= radius;
}

module.exports = {
    setFinalDestination,
    // setNextDestination,
    createNextDestination,
    atNextDestination,
    atFinalDestination
}