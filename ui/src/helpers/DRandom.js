// class to deterministically generate a random number given an initial seed
class DRandom {
    constructor(seed) {
        this.seed = seed;
    }

    next() {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    static seed = 0;
    static calls = 0;

    // random (alias for next)
    static random(newSeed) {
        if (newSeed) DRandom.seed = newSeed;
        const instance = new DRandom(DRandom.seed);
        const value = instance.next();
        DRandom.seed++;
        DRandom.calls++;
        return value;
    }

    // static randomRange method
    static randomRange(min, max) {
        const instance = new DRandom(DRandom.seed);
        const value = Math.floor(instance.next() * (max - min + 1) + min);
        DRandom.seed++;
        DRandom.calls++;
        return value;
    }
}

export default DRandom;
