import {JobScheduler} from "../../core/portsAndInterfaces/interfaces/index.js";

export class MyJobScheduler implements JobScheduler {
    constructor() {}

    startTimedJob(intervalInMilliseconds: number, job: () => void): void {
        setInterval(job, intervalInMilliseconds);
    }

}