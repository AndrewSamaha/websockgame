import { v4 as uuidv4 } from 'uuid';
import { rndPos, rndSpeed, rndDir } from "../helpers/physics";
import { animate } from '../animators/char';
import { animate as animateFrag } from '../animators/frag';
import { addChar } from '../state/chars';
import { MAX_FRAGS, MIN_FRAGS } from '../constants/frags';

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
}

export const MOVETYPES = {
    NONE: 0,
    STRAIGHT_LINE: 1,
    RANDOM_WALK: 2,
}

export const makeChar = (args) => ({
    id: uuidv4(),
    pos: rndPos(),
    timeCreatedOnClient: Date.now(),
    moves: false,
    history: {
        remove: false
    },
    moveType: MOVETYPES.NONE,
    type: CHARTYPES.NONE,
    hoverable: true,
    animate,
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
    representation: 'o',
    moves: true,
    maxHealth: 75,
    health: 75,
    damage: () => Math.random() * 10,
    range: 1,
    moveType: MOVETYPES.STRAIGHT_LINE,
    type: CHARTYPES.WORKER,
    ...args
})

export const makeFighter = (args) => ({
    ...makeWorker(),
    representation: 'A',
    moves: true,
    maxHealth: 200,
    health: 200,
    moveType: MOVETYPES.STRAIGHT_LINE,
    type: CHARTYPES.FIGHTER,
    ...args
})

export const makeArcher = (args) => ({
    ...makeFighter(),
    representation: '@',
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
    representation: '#',
    pos: {
      ...rndPos(),
      dir: Math.PI*.5
    },
    shoots: false,
    moves: false,
    ...args
})

export const makeTower = (args) => ({
    ...makeChar(),
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
