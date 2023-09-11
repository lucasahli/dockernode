const Redis = require('ioredis');
const redis = new Redis(); // Create a Redis client.

// Define a function to enqueue a scheduled job.
async function scheduleJob(jobType, jobData, timestamp) {
    const job = {
        type: jobType,
        data: jobData,
    };

    // Convert the timestamp to Unix timestamp (milliseconds since Epoch).
    const timestampMs = new Date(timestamp).getTime();

    // Add the job to the sorted set with the timestamp as the score.
    await redis.zadd('scheduledJobs', timestampMs, JSON.stringify(job));
}

// Define a function to process scheduled jobs.
async function processScheduledJobs() {
    while (true) {
        // Get the timestamp of the earliest scheduled job.
        const earliestTimestamp = await redis.zrange('scheduledJobs', 0, 0, 'WITHSCORES');

        if (!earliestTimestamp || earliestTimestamp.length === 0) {
            // If no jobs are scheduled, wait for a short time and check again.
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
        }

        const jobTimestamp = parseFloat(earliestTimestamp[1]);
        const currentTime = Date.now();

        if (currentTime >= jobTimestamp) {
            // If the job's timestamp has arrived, pop and process the job.
            const [jobJson] = await redis.zpopmin('scheduledJobs');
            const job = JSON.parse(jobJson);

            // Simulate job processing (replace this with your actual job logic).
            console.log(`Processing scheduled job of type '${job.type}' with data:`, job.data);

            // Simulate job completion (mark the job as completed in a real system).
            console.log(`Scheduled job of type '${job.type}' completed.`);
        } else {
            // If the earliest job is in the future, wait until its timestamp arrives.
            const waitTime = jobTimestamp - currentTime;
            await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
    }
}

// Start a worker process to process scheduled jobs.
processScheduledJobs();

// Example: Schedule a job to run at a specific date and time.
const scheduledTime = new Date('2023-09-06T12:00:00Z'); // Replace with your desired timestamp.
scheduleJob('scheduledTask', { message: 'Scheduled task executed!' }, scheduledTime);