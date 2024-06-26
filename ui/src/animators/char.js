import Victor from 'victor';

import { dropChar, addChar } from '../state/chars';
import { MOVETYPES, CHARTYPES, makeBullet } from '../generators/units';
import { rndDirNudge, rndSpeedNudge, straightLineMove } from '../helpers/physics';
import { actOnNearestBug } from '../helpers/interaction';
import { globalStore } from '../state/globalStore';
import { createExplosion } from '../generators/units';
import { networkHistoryEvents } from '../constants/networkHistoryEvents';

export const animate = (deltaTime, viewport, store, storeName, mapParams, id, requestCreateUnit) => {
  const char = store.interactive.dict[id].get();

  if (!char) return;
  
  const { 
    pos,
    moves,
    moveType,
    maxAge,
    history,
    shoots,
    shotsPerSecond,
    type,
    lastFireTime,
    networkHistory } = char;
  const { x, y, dir, speed, intermediateDestination } = pos; 

  // Age
  if (true && maxAge && networkHistory) {
    const birthTime = networkHistory.find(({event}) => event === networkHistoryEvents.FIRST_RECEIVED_FROM_SERVER).time;
    if (birthTime && Date.now() - birthTime > maxAge) {
      dropChar(storeName, id, store);
      return;
    } else {
      char.age = Date.now() - birthTime;
    }
  }
  if (true && maxAge && history) {
    if (!history.birthTime) history.birthTime = Date.now();
    if (Date.now() - history.birthTime > maxAge) {
      dropChar(storeName, id, store);
      return;
    }
  }

  if (true && shoots) {
    if (!lastFireTime || Date.now() - lastFireTime > (1 / shotsPerSecond * 1000)) {
      actOnNearestBug(char, globalStore.interactive.dict.get(), 10_000, (target) => {
        requestCreateUnit(addChar(storeName, {
            ...makeBullet(),
            pos: {
              x,
              y,
              dir: (new Victor(target.pos.x, target.pos.y)).subtract((new Victor(pos.x, pos.y))).angle() + Math.PI,
              speed: .2
            }
          },
          store))
        store.interactive.dict[id].lastFireTime.set(Date.now());
      })
    } 
  }

  if (type === CHARTYPES.BULLET)
    actOnNearestBug(char, globalStore.interactive.dict.get(), 400, (target) => {
      createExplosion(target, globalStore);
      dropChar(storeName, target.id, store);
      dropChar(storeName, char.id, store)
    });

  // Movement
  if (!moves) {
    return;
  }
  
  let newPosition = {
    x,
    y,
    dir,
    speed
  };

  switch (moveType) {
    // case MOVETYPES.GOTO_SPOT:
    //   //newPosition = stepToIntermediateDestination({
    //   break;
    case MOVETYPES.RANDOM_WALK:
      newPosition = straightLineMove({
        x,
        y,
        dir,// dir: rndDirNudge(dir), 
        speed //: rndSpeedNudge(speed)
      }, mapParams, deltaTime)
      break;
    case MOVETYPES.STRAIGHT_LINE:
      newPosition = straightLineMove({
        x,
        y,
        dir, 
        speed
      }, mapParams, deltaTime)
      break;
    case MOVETYPES.NONE:
    default:
      break
  }

  store.interactive.dict[id].pos.set(newPosition);
};
