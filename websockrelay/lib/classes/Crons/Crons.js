const { v4: uuidv4 } = require('uuid');

// Create a cron job class to manage events
class CronJob {
    constructor(frequency, fn, runOnce = false) {
        this.frequency = frequency
        this.fn = fn
        this.id = uuidv4()
        this.runOnce = runOnce;
    }
    setNextRunTime(now = Date.now()) {
        this.nextRunTime = now + this.frequency;
        this.nextDeadline = now + this.frequency * 2;
    }
    setStartTime(now) {
        this.startTime = now;
        this.setNextRunTime(now)
    }
    doJob(){
        this.fn()
        this.setNextRunTime()
    }
}
  
class Crons {
    constructor(checkInterval = 1000) {
        this.cronjobs = [];
        this.started = false;
        this.checkInterval = checkInterval;
        this.intervalHandle = null;
    }

    addJob(frequency, fn, runOnce = false) {
        const job = new CronJob(frequency, fn, runOnce)
        this.cronjobs.push(job)
        return job.id
    }

    removeJob(id) {
        this.cronjobs = this.cronjobs.filter(j => j.id !== id)
    }

    start() {
        this.started = true;
        const now = Date.now();
        this.cronjobs.forEach(j => j.setStartTime(now))
        console.log(`starting cron, checkInterval = ${this.checkInterval} ms, ${this.cronjobs.length} jobs to defined`)
        this.intervalHandle = setInterval(() => {
            this.doJobs()
        }, this.checkInterval)
        return this.intervalHandle;
    }

    doJobs() {
        if (!this.started) {
            this.start()
        }
        this.cronjobs = this.cronjobs.reduce((acc, job) => {
            let ran = false;
            const now = Date.now();
            if (now >= job.nextRunTime && now < job.nextDeadline) {
                job.doJob()
                ran = true;
            }
            if (ran && (job.runOnce || job.nextDeadline < now)) {
                return acc;
            }
            
            acc.push(job);
            return acc;

        }, []);
    }

}

module.exports = Crons;
