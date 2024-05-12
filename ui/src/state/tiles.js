import { BACKGROUND_TILE_SIZE } from "../constants/backgroundtiles"


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
    const numLines = 20;
    let result = '';
    for (let i = 0; i < numLines; i++) {
        result += generateRandomLine(51);
    }
    return result;
}

export const createInitialTileState = () => {
    const backgroundTiles = [];
    const maxTiles = 10;
    for (let x = 0; x < maxTiles; x++) {
        for (let y = 0; y < maxTiles; y++) {
            // Generate ASCII art for the tile
            const asciiArt = generateAsciiArtForTile(x, y);

            backgroundTiles.push({
                id: x + y * 10,
                pos: {
                    x: x * BACKGROUND_TILE_SIZE,
                    y: y * BACKGROUND_TILE_SIZE
                },
                asciiArt
            });
        }
    }

    return {
        backgroundTiles
    }
}
