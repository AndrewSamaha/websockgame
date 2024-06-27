import { v4 as uuidv4 } from 'uuid';
import { rndPos, rndSpeed, rndDir } from "../helpers/physics";
import { animate } from '../animators/char';
import { animate as animateFrag } from '../animators/frag';
import { addChar } from '../state/chars';
import { MAX_FRAGS, MIN_FRAGS } from '../constants/frags';
import { ACTIONS } from './actions';

export const CHARTYPES = {
    NONE: 'NONE',
    ARCHER: 'ARCHER',
    BASE: 'BASE',
    BUG: 'BUG',
    BULLET: 'BULLET',
    FRAG: 'FRAG',
    FIGHTER: 'FIGHTER',
    RESOURCE: 'RESOURCE',
    TOWER: 'TOWER',
    WORKER: 'WORKER',
    LIBRARY: 'LIBRARY',
    MAGE: 'MAGE',
    GOLEM: 'GOLEM',
    BARRACKS: 'BARRACKS',
    FARM: 'FARM',
}

export const MOVETYPES = {
    NONE: 'NONE',
    STRAIGHT_LINE: 'STRAIGHT_LINE',
    RANDOM_WALK: 'RANDOM_WALK',
}

export const makeChar = (args) => ({
    id: uuidv4(),
    pos: rndPos(),
    maxHealth: 1,
    health: 1,
    maxSpeed: 0.05,
    timeCreatedOnClient: Date.now(),
    moves: false,
    history: {
        remove: false
    },
    moveType: MOVETYPES.NONE,
    type: CHARTYPES.NONE,
    hoverable: true,
    animate,
    actions: {
        rightClickOnLayer: ACTIONS.none.name,
        rightClickOnFriendlyChar: ACTIONS.none.name,
        rightClickOnEnemyChar: ACTIONS.none.name,
    },
    ...args
});

export const makeResource = (args) => ({
    ...makeChar(),
    representation: '$',
    moves: false,
    maxAge: 0,
    moveType: MOVETYPES.NONE,
    type: CHARTYPES.RESOURCE,
    ...args
});

export const makeBug = (args) => ({
    ...makeChar(),
    representation: 'A',
    moves: true,
    maxAge: 30_000 * Math.random(),
    moveType: MOVETYPES.RANDOM_WALK,
    type: CHARTYPES.BUG,
    ...args
})

export const makeWorker = (args) => ({
    ...makeChar(),
    representation: 'u',
    moves: true,
    maxHealth: 75,
    health: 75,
    damage: () => Math.random() * 10,
    range: 1,
    moveType: MOVETYPES.STRAIGHT_LINE,
    type: CHARTYPES.WORKER,
    actions: {
        rightClickOnLayer: ACTIONS.setMoveDestination.name,
        rightClickOnFriendlyChar: ACTIONS.setMoveDestination.name,
        rightClickOnEnemyChar: ACTIONS.setAttackTarget.name,
    },
    builds: [
        CHARTYPES.BASE,
        CHARTYPES.TOWER
    ],
    ...args
})

export const makeFighter = (args) => ({
    ...makeWorker(),
    representation: 'a',
    moves: true,
    maxHealth: 200,
    health: 200,
    moveType: MOVETYPES.STRAIGHT_LINE,
    type: CHARTYPES.FIGHTER,
    builds: [],
    ...args
})

export const makeArcher = (args) => ({
    ...makeFighter(),
    representation: 'e',
    moves: true,
    maxHealth: 150,
    health: 150,
    shoots: true,
    damage: () => Math.random() * 10,
    range: 5,
    moveType: MOVETYPES.STRAIGHT_LINE,
    type: CHARTYPES.ARCHER,
    ...args
})

export const makeMage = (args) => ({
    ...makeArcher(),
    representation: 'n',
    moves: true,
    maxHealth: 60,
    health: 60,
    shoots: true,
    damage: () => Math.random() * 10,
    range: 10,
    moveType: MOVETYPES.STRAIGHT_LINE,
    type: CHARTYPES.MAGE,
    ...args
})

export const makeGolem = (args) => ({
    ...makeFighter(),
    representation: 'g',
    moves: true,
    maxHealth: 400,
    health: 400,
    moveType: MOVETYPES.STRAIGHT_LINE,
    type: CHARTYPES.GOLEM,
    ...args
})

export const makeBullet = (args) => ({
    ...makeChar(),
    representation: '^',
    moves: true,
    maxAge: 1_000,
    moveType: MOVETYPES.STRAIGHT_LINE,
    type: CHARTYPES.BULLET,
    hoverable: false,
    ...args
})

export const makeBase = (args) => ({
    ...makeChar(),
    maxHealth: 300,
    health: 300,
    representation: '#',
    pos: {
        ...rndPos(),
        dir: Math.PI*.5
    },
    shoots: false,
    moves: false,
    type: CHARTYPES.BASE,
    builds: [
        CHARTYPES.WORKER,
    ],
    ...args
})

export const makeFarm = (args) => ({
    ...makeChar(),
    maxHealth: 100,
    health: 100,
    representation: 'F',
    pos: {
        ...rndPos(),
        dir: Math.PI*.5
    },
    shoots: false,
    moves: false,
    type: CHARTYPES.FARM,
    ...args
})

export const makeLibrary = (args) => ({
    ...makeChar(),
    maxHealth: 100,
    health: 100,
    representation: 'L',
    pos: {
        ...rndPos(),
        dir: Math.PI*.5
    },
    shoots: false,
    moves: false,
    type: CHARTYPES.LIBRARY,
    builds: [
        CHARTYPES.MAGE,
        CHARTYPES.GOLEM
    ],
    ...args
})

export const makeBarracks = (args) => ({
    ...makeChar(),
    maxHealth: 200,
    health: 200,
    representation: 'B',
    pos: {
        ...rndPos(),
        dir: Math.PI*.5
    },
    shoots: false,
    moves: false,
    type: CHARTYPES.BARRACKS,
    builds: [
        CHARTYPES.FIGHTER,
        CHARTYPES.ARCHER
    ],
    ...args
})


export const makeTower = (args) => ({
    ...makeChar(),
    maxHealth: 100,
    health: 100,
    representation: 'T',
    pos: {
        ...rndPos(),
        dir: Math.PI*.5
    },
    shoots: true,
    moves: false,
    shotsPerSecond: 2,
    type: CHARTYPES.TOWER,
    ...args
});

const fragLetters = 'aloisu.,:123oknndi';
export const makeFrag = (args) => {
    // destructure x and y from args, or if args is undefined, set x and y to 0
    const { x, y, ...otherArgs } = args || { x: 0, y: 0 };
    const id = uuidv4();

    return {
        id,
        uuid: id,
        representation: fragLetters[Math.floor(fragLetters.length * Math.random())],
        pos: {
            x,
            y,
            dir: rndDir(),
            speed: rndSpeed(),
            spin: rndDir()
        },
        maxAge: 200 * Math.random() + 1_000 * Math.random() + 3_000 * Math.random(),
        type: CHARTYPES.FRAG,
        history: {
            remove: false
        },
        animate: animateFrag,
        ...otherArgs
    }
};

export const createExplosion = ({ pos }, store) => {
    for (let x = 1; x <= Math.floor(Math.random()*MAX_FRAGS)+MIN_FRAGS; x++) {
        addChar('independent', makeFrag(pos), store);
    }
    return { id: 'justFrags' };
}
