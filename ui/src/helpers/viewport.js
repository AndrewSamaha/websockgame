import { GAME_SIZE } from "../constants/game"

let xMod = GAME_SIZE.width/2;
let yMod = GAME_SIZE.height/2;

export const worldXtoScreenX = (worldX, viewportX) => (worldX - viewportX + xMod);
export const worldYtoScreenY = (worldY, viewportY) => (worldY - viewportY + yMod);

export const screenXtoWorldX = (screenX, viewportX) => (screenX + viewportX - xMod);
export const screenYtoWorldY = (screenY, viewportY) => (screenY + viewportY - yMod);

export const pageXtoWorldX = (pageX, viewportX) => (pageX + viewportX - xMod);
export const pageYtoWorldY = (pageY, viewportY) => (pageY + viewportY - yMod);

export const mouseEventToWorldCoordinates = (e, layerElement, viewportX, viewportY) => {
    const layerRect = layerElement.getBoundingClientRect();
    const layerLeft = layerRect.left;
    const layerTop = layerRect.top;
    
    const pageX = e.nativeEvent.pageX;
    const pageY = e.nativeEvent.pageY;

    const x = pageX + viewportX - xMod - layerLeft;
    const y = pageY + viewportY - yMod - layerTop;
    return { x, y };
}
