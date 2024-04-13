const Victor = require('victor');

export const straightLineMove = ({pos, mapParams, delta}) => {
    const straightLineDistance = delta * pos.speed;
    const vec = new Victor(0, straightLineDistance);
    let {x, y} = vec.rotateBy(pos.dir);
    x += pos.x;
    y += pos.y;

    return {
        x,
        y,
        dir: pos.dir,
        speed: pos.speed
    };
}
