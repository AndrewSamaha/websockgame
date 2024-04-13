const Victor = require('victor');

class Node {

}
const isProjectile = (unit) => unit.type === 'BULLET';

class UnitState {
    constructor() {
        this.targets = [];
        this.projectiles = [];
    }

    addUnit(unit) {
        if (isProjectile(unit)) {
            this.projectiles.push(unit);
            return;
        }
        this.targets.push(unit);
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

    tic() {
        this.ticDoProjectiles();
    }
}

export default UnitState;
