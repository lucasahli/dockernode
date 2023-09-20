export interface JobScheduler {
    startTimedJob(intervalInMilliseconds: number, job: () => void): void;
}