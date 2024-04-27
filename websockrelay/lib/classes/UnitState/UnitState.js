const Victor = require('victor');
const { v4: uuidv4 } = require('uuid');
const { performance } = require('perf_hooks');

const { straightLineMove } = require('../../helpers/physics');

const isProjectile = (unit) => unit.type === 'BULLET';

class UnitState {
    constructor() {
        this.targets = [];
        this.projectiles = [];
        this.lastTicTime = Date.now();

        this.broadcasts = 0;
        this.tics = 0;
    }

    attachIO(io) {
        this.io = io;
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
        //console.log(`  adding ${unit.type} to unitState [${this.targets.length},${this.projectiles.length}]`)
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

    moveUnit(unit, delta) {
        const newPosition = straightLineMove({pos: unit.pos, delta});
        unit.pos = newPosition;
        return;
    }

    ageUnits(collection) {
        const now = Date.now();
        return collection.reduce((acc, unit) => {
            if (!unit.maxAge) {
                acc.active.push(unit);
                return acc;
            }
            if (!unit.timeServerFirstTic) {
                unit.timeServerFirstTic = now;
                acc.active.push(unit);
                return acc;
            }
            if (now - unit.timeServerFirstTic < unit.maxAge) {
                acc.active.push(unit);
                return acc;
            }
            acc.dead.push(unit);
            return acc;
        },{
            active: [],
            dead: []
        });
    }

    moveUnits(collection, delta) {
        collection.forEach(target => {
            this.moveUnit(target, delta);
        })
    }

    incrementBroadcasts(collection) {
        collection.forEach((unit)=> {
            if (!unit.broadcasts) unit.broadcasts = 0;
            unit.broadcasts++;
        })
    }

    broadcastState({io}) {
        this.broadcasts++;
        this.incrementBroadcasts(this.targets);
        this.incrementBroadcasts(this.projectiles);
        const message = {
            broadcastId: uuidv4(),
            timeServer: Date.now(),
            units: [...this.targets, ...this.projectiles],
            broadcastNumber: this.broadcasts,
            ticNumber: this.tics
        }
        if (this.lastTicTime) message['age'] = Date.now() - this.lastTicTime;
        io.emit('unitState', message);
        console.log(`${this.tics} ${this.broadcasts} id=${message.broadcastId} units.length=${message.units.length}`)
        //console.log(this.targets)
    }

    tic() {
        this.tics++;
        const perf_ticStartTime = performance.now();

        const ticStartTime = Date.now();
        const delta = ticStartTime - this.lastTicTime;

        // age units
        const { active: activeProjectiles, dead: deadProjectiles } = this.ageUnits(this.projectiles);
        const { active: activeTargets, dead: deadTargets } = this.ageUnits(this.targets);
        this.targets = activeTargets;
        this.projectiles = activeProjectiles;

        // move units
        this.moveUnits(this.targets, delta);
        this.moveUnits(this.projectiles, delta);

        this.lastTicTime = ticStartTime;
        const perf_ticStopTime = performance.now();
        const perf_duration = perf_ticStopTime - perf_ticStartTime;

        // console.log(`tic duration: ${Math.floor(perf_duration*1000)} us for ${(this.targets.length + this.projectiles.length)}, pruned ${deadTargets.length + deadProjectiles.length} units`)
    }
}

module.exports = UnitState;
