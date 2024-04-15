const Victor = require('victor');

class Node {

}
const isProjectile = (unit) => unit.type === 'BULLET';

class UnitState {
    constructor() {
        this.targets = [];
        this.projectiles = [];
    }

    addTarget(target) {
        // check to make sure target doesn't already exist in targets
        if (this.targets.find(t => t.id === target.id)) {
            console.log(`  target ${target.id} already exists in unitState`)
            return
        };
        this.targets.push(target);
    }

    addProjectile(projectile) {
        if (this.projectiles.find(p => p.id === projectile.id)) {
            console.log(`  projectile ${target.id} already exists in unitState`)
            return;
        }
        this.projectiles.push(projectile);
    }

    addUnit(unit) {
        console.log(`  adding ${unit.type} to unitState [${this.targets.length},${this.projectiles.length}]`)
        if (isProjectile(unit)) return this.addProjectile(unit);
        this.addTarget(unit);
    }

    getActiveProjectiles() {
        return this.projectiles.filter(unit => {
            if (unit.age && unit.maxAge) return unit.age < unit.maxAge;
            return true;

        });
    }

    getActiveTargets() {
        return this.targets.filter(unit => {
            if (unit.age && unit.maxAge) return unit.age < unit.maxAge;
            return true;
        });
    
    }

    ticDoProjectiles() {
        const projectiles = getActiveProjectiles();
        if (projectiles.length === 0) return;
        // calculate each projectile's new position
        const now = Date.now();

        projectiles.forEach(projectile => {
            projectile.pos.x += projectile.vel.x;
            projectile.pos.y += projectile.vel.y;
            projectile.age++;
        });
        const targets = getActiveTargets();
        if (targets.length === 0) return;
        projectiles.forEach(projectile => {
            const target = targets.find(target => {
                const targetPos = new Victor(target.pos.x, target.pos.y);
                const projectilePos = new Victor(projectile.pos.x, projectile.pos.y);
                return targetPos.distance(projectilePos) < 1;
            });
            if (target) {
                target.health -= projectile.damage;
                projectile.age = projectile.maxAge;
            }
        });
    }

    moveUnit(unit) {
        newPosition = straightLineMove(unit.pos);
        unit.pos = newPosition;
        return;
        switch (unit.moveType) {
            case 'RANDOM_WALK':
                newPosition = straightLineMove({
                    x: unit.pos.x,
                    y: unit.pos.y,
                    dir: rndDirNudge(unit.pos.dir),
                    speed: rndSpeedNudge(unit.pos.speed)
                });
                break;
            case 'STRAIGHT_LINE':
                newPosition = straightLineMove(unit.pos);
                break;
            default:

                break;
        }
        unit.pos = newPosition;
    }

    tic() {
        this.targets.forEach(target => {
            this.moveUnit(target);
        })
        this.projectiles.forEach(projectile => {
            this.moveUnit(projectile);
        });
    }
}

module.exports = UnitState;
