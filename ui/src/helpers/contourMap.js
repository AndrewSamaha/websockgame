import DRandom from "./DRandom";
// procedural function to generate an array that represents
// elevation in a 2-dimensional contour map
// the function takes as parameters:
//  - the width and height of the map
//  - a seed for the random number generator
//  - a maximum elevation value
//  - a minimum elevation value
//  - and the following optional parameters:
//      - an array representing the elevation of the map on the left edge
//      - an array representing the elevation of the map on the top edge
//      - an array representing the elevation of the map on the right edge
//      - an array representing the elevation of the map on the bottom edge
// the function returns a 2-dimensional array of numbers
// representing the elevation of the map
// the function uses the diamond-square algorithm to generate the map
// the diamond-square algorithm is a fractal algorithm that generates
// a height map by dividing the map into smaller squares and then
// subdividing each square into four smaller squares

export const generateContourMap = (width, height, seed, maxElevation, minElevation, leftEdge, topEdge, rightEdge, bottomEdge) => {
    if (seed) DRandom.set = seed;
    // create a 2-dimensional array to store the elevation of the map
    const map = [];
    for (let i = 0; i < height; i++) {
        map[i] = [];
        for (let j = 0; j < width; j++) {
            map[i][j] = 0;
        }
    }

    // set the elevation of the corners of the map
    map[0][0] = leftEdge ? leftEdge[0] : DRandom.random() * (maxElevation - minElevation) + minElevation;
    map[0][width - 1] = rightEdge ? rightEdge[0] : DRandom.random() * (maxElevation - minElevation) + minElevation;
    map[height - 1][0] = bottomEdge ? bottomEdge[0] : DRandom.random() * (maxElevation - minElevation) + minElevation;
    map[height - 1][width - 1] = topEdge ? topEdge[0] : DRandom.random() * (maxElevation - minElevation) + minElevation;

    // set the elevation of the edges of the map
    for (let i = 1; i < height - 1; i++) {
        map[i][0] = leftEdge ? leftEdge[i] : DRandom.random() * (maxElevation - minElevation) + minElevation;
        map[i][width - 1] = rightEdge ? rightEdge[i] : DRandom.random() * (maxElevation - minElevation) + minElevation;
    }
    for (let j = 1; j < width - 1; j++) {
        map[0][j] = topEdge ? topEdge[j] : DRandom.random() * (maxElevation - minElevation) + minElevation;
        map[height - 1][j] = bottomEdge ? bottomEdge[j] : DRandom.random() * (maxElevation - minElevation) + minElevation;
    }

    // set the elevation of the center of the map
    const center = {
        x: Math.floor(width / 2),
        y: Math.floor(height / 2)
    };
    map[center.y][center.x] = DRandom.random() * (maxElevation - minElevation) + minElevation;

    // finish implementing the diamond-square algorithm
    // here
    // calculate the size of the map
    const size = Math.max(width, height);

    // calculate the number of iterations needed
    const iterations = Math.ceil(Math.log2(size));

    // iterate over each iteration
    for (let iteration = 0; iteration < iterations; iteration++) {
        const stepSize = Math.pow(2, iterations - iteration);

        // perform the diamond step
        for (let y = 0; y < height - stepSize; y += stepSize) {
            for (let x = 0; x < width - stepSize; x += stepSize) {
                const topLeft = map[y][x];
                const topRight = map[y][x + stepSize];
                const bottomLeft = map[y + stepSize][x];
                const bottomRight = map[y + stepSize][x + stepSize];

                const average = (topLeft + topRight + bottomLeft + bottomRight) / 4;
                const randomOffset = DRandom.randomRange(-stepSize / 2, stepSize / 2);

                map[y + stepSize / 2][x + stepSize / 2] = average + randomOffset;
            }
        }

        // perform the square step
        for (let y = 0; y < height - stepSize; y += stepSize / 2) {
            for (let x = 0; x < width- stepSize; x += stepSize / 2) {
                const topLeft = map[y][x];
                const topRight = map[y][x + stepSize / 2];
                const bottomLeft = map[y + stepSize / 2][x];
                const bottomRight = map[y + stepSize / 2][x + stepSize / 2];

                const average = (topLeft + topRight + bottomLeft + bottomRight) / 4;
                const randomOffset = DRandom.randomRange(-stepSize / 2, stepSize / 2);

                // check if the current position is on the edge of the map
                const isOnEdge = x === 0 || y === 0 || x + stepSize / 2 === width || y + stepSize / 2 === height;

                if (!isOnEdge) {
                    map[y + stepSize / 2][x + stepSize / 2] = average + randomOffset;
                }
            }
        }
    }

    // return the generated map
    return map;
}

export const charspaceGivenElevationFine = (elevation) => {
    if (elevation < 0.1) {
        return '$@B%8&WM';
    } else if (elevation < 0.2) {
        return '#*oahkb';
    } else if (elevation < 0.3) {
        return 'dpqwmZO';
    } else if (elevation < 0.4) {
        return '0QLCJU';
    } else if (elevation < 0.5) {
        return 'YXzcvu';
    } else if (elevation < 0.6) {
        return 'nxrjft';
    } else if (elevation < 0.7) {
        return '/\\|()1{}';
    } else if (elevation < 0.8) {
        return '[]?-_+~';
    } else if (elevation < 0.9) {
        return '<>i!lI;';
    } else {
        return ',"^`\'.';
    }
}

export const charspaceGivenElevationThick = (elevation) => {
    if (elevation < 0.3) {
        return '$@B%8&WM';
    } 
    if (elevation < 0.7) {
        return '/\\|()1{}     ';
    }
    return ',"^`\'.               ';
    
}


export const charGivenElevation = (elevation) => {
    const characters = charspaceGivenElevationThick(elevation);
    const spaceWeight = 0;
    const characterWeight = 1;
    const space = ' ';
    return Math.random() < spaceWeight / (spaceWeight + characterWeight) ? space : characters[Math.floor(Math.random() * characters.length)];
}

export const convertContourMapToAsciiArt = (contourMap) => {
    const asciiArt = contourMap.map(row => row.map(charGivenElevation).join('')).join('\n');
    return asciiArt;
}
