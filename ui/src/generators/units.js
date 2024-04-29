import { v4 as uuidv4 } from 'uuid';
import { rndPos, rndSpeed, rndDir } from "../helpers/physics";
import { animate } from '../animators/char';
import { animate as animateFrag } from '../animators/frag';
import { addChar } from '../state/chars';
import { MAX_FRAGS, MIN_FRAGS } from '../constants/frags';

export const CHARTYPES = {
    NONE: 'NONE',
    TOWER: 'TOWER',
    BUG: 'BUG',
    BULLET: 'BULLET',
    FRAG: 'FRAG',
    RESOURCE: 'RESOURCE',
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

export const makeBullet = (args) => ({
    ...makeChar(),
    representation: '^',
    moves: true,
    maxAge: 1_000,
    moveType: MOVETYPES.STRAIGHT_LINE,
    type: CHARTYPES.BULLET,
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
