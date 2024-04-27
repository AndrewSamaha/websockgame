import { GAME_SIZE } from "../constants/game"

let xMod = GAME_SIZE.width/2;
let yMod = GAME_SIZE.height/2;

export const worldXtoScreenX = (worldX, viewportX) => (worldX - viewportX + xMod);
export const worldYtoScreenY = (worldY, viewportY) => (worldY - viewportY + yMod);
export const screenXtoWorldX = (screenX, viewportX) => (screenX + viewportX - xMod);
export const screenYtoWorldY = (screenY, viewportY) => (screenY + viewportY - yMod);
