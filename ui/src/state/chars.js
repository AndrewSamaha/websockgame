import { observable } from "@legendapp/state"
import omit from "lodash/omit";
import compact from "lodash/compact";

import { makeBug, makeTower } from '../generators/units';
import { networkHistoryEvents } from "../constants/networkHistoryEvents";



export const createObjectStore = (object, entityArray, storeName = 'UnnamedStore') => {
    const store = entityArray.reduce((acc, cur) => {
        if (!cur.id) return acc;
        const id = cur.id;
        acc.dict[id] = cur;
        acc.idArray.push(id);
        return acc;
    }, {
        name: storeName,
        dict: {},
        idArray: []
    })
    return {
        ...object,
        [storeName]: store
    };
}

export const createInitialGameState = () => {

    console.log('creating initial game state')
    const initialState = {
        numTowers: 0,
        numBugs: 0
    }
    
    const chars = {};
    for (let i = 0; i < initialState.numBugs; i++) {
        const A = makeBug();
        chars[A.id] = A;
    }
    for (let i = 0; i < initialState.numTowers; i++) {
        const A = makeTower();
        chars[A.id] = A;
    }
    return {
        independent: {
            dict: {},
            idArray: []
        },
        interactive: {
            dict: chars,
            idArray: Object.keys(chars)
        }
    };
}


export const charsObservable = observable(createInitialGameState());

const validateParams = ({storeName, thisObservable, fnName='undefined'}) => {
    if (!thisObservable)
        throw(`no observable passed to ${fnName}`)
    if (!(typeof storeName === 'string' || storeName instanceof String))
        throw(`something not a string was passed to drop.storeName ${storeName} passed to ${fnName}`)
    return true;
}

export const dropChar = (storeName, id, thisObservable=null, prevalidated=false) => {
    if (!prevalidated) validateParams({storeName, thisObservable});
    thisObservable[storeName].idArray.set(
        compact(thisObservable[storeName].idArray.get()).filter(thisId => thisId !== id)
    );
    thisObservable[storeName].dict.set(
        omit(thisObservable[storeName].dict.get(), id)
    );
}

export const addChar = (storeName, char, thisObservable=null, prevalidated=false) => {
    if (!prevalidated) validateParams({storeName, thisObservable, fnName: 'addChar'});
    if (!char || !char.id) return;
    const idArray = thisObservable[storeName].idArray?.get() || [];
    if (idArray.includes(char.id)) return;
    if (!thisObservable) return char;

    thisObservable[storeName].idArray.set([...idArray, char.id]);
    const newDict = {...thisObservable[storeName].dict.get(), [char.id]: {
        ...char,
        upserted: false,
        networkHistory: [{
            time: Date.now(),
            event: networkHistoryEvents.FIRST_RECEIVED_FROM_SERVER,
            x: char.pos.x
        }]
    }};
    thisObservable[storeName].dict.set(newDict);
    return char;
}

const charDiff = (char1, char2) => {
    return compact(Object.entries(char1).map(([key, val]) => {
        //return {key, val, newVal: char2[key]};
        if (key === 'pos') {
            const posDiff = charDiff(char1[key], char2[key]);
            if (posDiff && posDiff.length) return {key, posDiff, speed: char2[key].speed, speedDiff: (char2[key].speed - char1[key].speed)};
            return null;
        }
        if (key === 'networkHistory') return null;
        if (char2[key] !== val) {
            return {key, diff: (char2[key] - val), val, newVal: char2[key]};
        }
        return null;
    }));
}

export const upsertChar = (storeName, char, thisObservable=null, prevalidated=false) => {
    if (!prevalidated) validateParams({storeName, thisObservable, fnName: 'upsertChar'});
    if (!char || !char.id) return;
    const idArray = thisObservable[storeName].idArray?.get() || [];
    if (idArray.includes(char.id)) {
        const diff = charDiff(thisObservable[storeName].dict[char.id].get(), char);
        const existingChar = thisObservable[storeName].dict[char.id].get();
        // console.log(diff);
        
        const upsertedChar = {
            ...char,
            upserted: true,
            networkHistory: [
                ...existingChar.networkHistory,
                {
                    age: (Date.now() - existingChar.networkHistory[0].time),
                    event: networkHistoryEvents.UPSERT_FROM_SERVER,
                    x: char.pos.x,
                    y: char.pos.y
                }
            ]
        };
        if (upsertedChar.broadcasts >= 3) {
            console.log(upsertedChar)
            console.log(diff)
        }
        thisObservable[storeName].dict[char.id].set(upsertedChar);
        return upsertedChar;
    } else {
        return addChar(storeName, char, thisObservable, prevalidated=true)
    }
}

export const upsertChars = (storeName, charArray, thisObservable=null, prevalidated=false) => {
    if (!prevalidated) validateParams({storeName, thisObservable, fnName: 'upsertChars'});
    if (!charArray || !charArray.length) return;
    charArray.forEach(char => upsertChar(storeName, char, thisObservable, prevalidated=true))
}

export const truncAndInsertChars = (storeName, charArray, thisObservable=null, prevalidated=false) => {
    if (!prevalidated) validateParams({storeName, thisObservable, fnName: 'truncAndInsertChars'});
    if (!charArray || !charArray.length) return;
    thisObservable[storeName].idArray.set([]);
    thisObservable[storeName].dict.set({});
    charArray.forEach(char => addChar(storeName, char, thisObservable, prevalidated=true))
}
