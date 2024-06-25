import { observable } from '@legendapp/state';
import Victor from 'victor';
import { GAME_SIZE } from '../constants/game';
import { createInitialGameState } from './chars';
import { createInitialTileState } from './tiles';
import { ACTIONS } from '../generators/actions';

console.log(`generating globalStore`)
export const globalStore = observable({
    viewport: {
      pos: {
        x: GAME_SIZE.width/2,
        y: GAME_SIZE.height/2,
        dir: 0,
        speed: 0
      },
      input: {
        //include: ['KeyW', 'KeyA', 'KeyS', 'KeyD'],
      },
      force: new Victor(0,0),
      convertKeysToForce: (now = Date.now()) => {
        let vector = Object.entries(globalStore.viewport.input.peek()).reduce((acc, [key, startTime]) => {
          if (!startTime) return acc;
          let length = now - startTime;
  
          // set keytime to now
          globalStore.viewport.input[key].set(now);
  
          // Create vector and add to accumulator
          const vector = new Victor(length, 0);
          if (key === 'KeyD') return acc.add(vector);
          if (key === 'KeyW') return acc.add(vector.rotateByDeg(270));
          if (key === 'KeyA') return acc.add(vector.rotateByDeg(180));
          if (key === 'KeyS') return acc.add(vector.rotateByDeg(90));
          
          throw(`convertKeysToForce, unknown key $(key)`)
        }, new Victor(0,0))
        if (vector.lengthSq() == 0) return;
        if (vector.lengthSq() < 10) {
          //console.log('truncating vector', vector.length(), vector.lengthSq())
          vector = new Victor(0,0);
        }
        //console.log('NOT truncating victor', vector.lengthSq())
        globalStore.viewport.force.set(vector);
      },
      moveViewport: (delta) => {
        const moveVector = globalStore.viewport.force.peek();
        if (moveVector.lengthSq() < 1.1) return;
        const pos = globalStore.viewport.pos.peek();
        const distance = delta / 70;
        const position = new Victor(pos.x, pos.y)
          .add(moveVector.multiply(new Victor(distance,distance)));
        globalStore.viewport.pos.x.set(position.x);
        globalStore.viewport.pos.y.set(position.y);
      }
    },
    user: {
      username: '',
      id: '',
      loggedIn: false,
      color: null
    },
    ui: {
      dynamicFunctions: {
        leftClickAction: () => {},
        rightClickAction: () => {}
      },
      performLayerLeftClickActionOnce: (args) => {
        const { leftClickAction } = globalStore.ui.dynamicFunctions.peek();
        if (leftClickAction && typeof leftClickAction === 'function')
            leftClickAction(args);
        globalStore.ui.setLayerLeftClickAction(null);
      },
      performLayerRightClickActionOnce: (args) => {
        const { rightClickAction } = globalStore.ui.dynamicFunctions.peek();
        if (rightClickAction && typeof rightClickAction === 'function')
            rightClickAction({
              ...args,
              unit: globalStore.ui.getSelectedChar()
            });
        globalStore.ui.setLayerRightClickAction(null);
      },
      hovered_char: null,
      selected_char: null,
      setHoveredChar: (char) => {
        globalStore.ui.hovered_char.set(char);
      },
      getHoveredChar: () => globalStore.ui.hovered_char.peek(),
      setSelectedChar: (char) => {
        globalStore.ui.selected_char.set(char);

        if (char.actions.rightClickOnLayer) {
          console.log('setting right click action', char.actions.rightClickOnLayer)
          globalStore.ui.setLayerRightClickAction(ACTIONS[char.actions.rightClickOnLayer].initiate)
        } else {
          globalStore.ui.setLayerRightClickAction(() => {})
        }
        if (char.actions.leftClickOnLayer) {
          console.log('setting left click action', char.actions.leftClickOnLayer)
          globalStore.ui.setLayerLeftClickAction(ACTIONS[char.actions.leftClickOnLayer].initiate)
        } else {
          globalStore.ui.setLayerLeftClickAction(() => {})
        }

      },
      getSelectedChar: () => globalStore.ui.selected_char.peek(),
      setLayerLeftClickAction: (action) => {
        globalStore.ui.dynamicFunctions.assign({
          ...globalStore.ui.dynamicFunctions.peek(),
          leftClickAction: action
        });
      },
      setLayerRightClickAction: (action) =>{
        globalStore.ui.dynamicFunctions.assign({
          ...globalStore.ui.dynamicFunctions.peek(),
          rightClickAction: action
        });
      }
    },
    console: {
      buffer: [],
      log: (message) => {
        globalStore.console.buffer.set([...globalStore.console.buffer.peek(), message]);
      },
    },
    ...createInitialGameState(),
    ...createInitialTileState()
  });

console.log(`generated globalStore ${Object.keys(globalStore.peek())}`)
console.log(`generated globalStore ${Object.keys(globalStore.interactive.peek())}`)