import { BACKGROUND_TILE_SIZE } from "../constants/backgroundtiles"
import { generateContourMap, convertContourMapToAsciiArt } from "../helpers/contourMap"

const TILE_CHARACTER_DIMENSIONS = {
    width: 31, // 600/77 =  7.792207792207792
    height: 31 // 600/31 = 19.35483870967742
    // 77 / 31 = 2.4838709677419355
}

const generateRandomCharacter = () => {
    const spaceWeight = 10;
    const characterWeight = 1;
    const space = ' ';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    return Math.random() < spaceWeight / (spaceWeight + characterWeight) ? space : characters[Math.floor(Math.random() * characters.length)];
}

const generateRandomLine = (lineLength) => {
    let result = '';
    for (let i = 0; i < lineLength; i++) {
        result += generateRandomCharacter();
    }
    return result + '\n';
}

const generateAsciiArtForTile = () => {
    // Replace this with your own logic for generating ASCII art
    // generate some random ascii art that is BACKGROUND_TILE_SIZE x BACKGROUND_TILE_SIZE
    const numLines = TILE_CHARACTER_DIMENSIONS.height;
    let result = '';
    for (let i = 0; i < numLines; i++) {
        result += generateRandomLine(TILE_CHARACTER_DIMENSIONS.width);
    }
    return result;
}


export const createInitialTileStateOld = () => {
    const contourMap = generateContourMap(
        TILE_CHARACTER_DIMENSIONS.width,
        TILE_CHARACTER_DIMENSIONS.height,
        1,
        1,
        0
    );
    const asciiArt = convertContourMapToAsciiArt(contourMap);

    const backgroundTiles = [];
    const maxTiles = 10;
    for (let x = 0; x < maxTiles; x++) {
        for (let y = 0; y < maxTiles; y++) {
            // Generate ASCII art for the tile
            //const asciiArt = generateAsciiArtForTile(x, y);

            backgroundTiles.push({
                id: x + y * 10,
                pos: {
                    x: x * BACKGROUND_TILE_SIZE.width,
                    y: y * BACKGROUND_TILE_SIZE.height
                },
                asciiArt
            });
        }
    }
    //console.log({contourMap})
    
    //console.log({asciiArt})
    return {
        backgroundTiles
    }
}

const getTileRightEdge = (tile) => {
    return tile.map(row => row[row.length - 1]);
}
const getTileBottomEdge = (tile) => {
    return tile[tile.length - 1];
}
export const createInitialTileState = () => {
    const maxTiles = 10;
    const elevationMaps = [];
    for (let x = 0; x < maxTiles; x++) {
        elevationMaps[x] = [];
        for (let y = 0; y < maxTiles; y++) {
            // Generate ASCII art for the tile
            //const asciiArt = generateAsciiArtForTile(x, y);
            const leftEdge = x ? getTileRightEdge(elevationMaps[x - 1][y]) : null;
            const topEdge = y ? getTileBottomEdge(elevationMaps[x][y - 1]) : null;
            const elevationMap = generateContourMap(
                TILE_CHARACTER_DIMENSIONS.width,
                TILE_CHARACTER_DIMENSIONS.height,
                1,
                1,
                0,
                leftEdge,
                topEdge
            );
            elevationMaps[x][y] = elevationMap;
        }
    }

    const backgroundTiles = [];
    for (let x = 0; x < maxTiles; x++) {
        for (let y = 0; y < maxTiles; y++) {
            // Generate ASCII art for the tile
            //const asciiArt = generateAsciiArtForTile(x, y);
            const asciiArt = convertContourMapToAsciiArt(elevationMaps[x][y]);

            backgroundTiles.push({
                id: x + y * 10,
                pos: {
                    x: x * BACKGROUND_TILE_SIZE.width,
                    y: y * BACKGROUND_TILE_SIZE.height
                },
                asciiArt
            });
        }
    }
    //console.log({contourMap})
    
    //console.log({asciiArt})
    return {
        backgroundTiles
    }
}
