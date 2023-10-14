//
//
// export class JobQueueService {
//     constructor(private jobRepository: JobRepository) {
//     }
//
//     // Define a function to enqueue a scheduled job.
//     async scheduleJob(jobType, jobData, dateTimeToRemind: Date) {
//
//
//         const job = {
//             type: jobType,
//             data: jobData,
//         };
//
//         // Convert the timestamp to Unix timestamp (milliseconds since Epoch).
//         const timestampMs = dateTimeToRemind.getTime();
//
//         // Add the job to the sorted set with the timestamp as the score.
//         await redis.zadd('scheduledJobs', timestampMs, JSON.stringify(job));
//     }
//
// // Define a function to process scheduled jobs.
//     async processScheduledJobs() {
//         while (true) {
//             // Get the timestamp of the earliest scheduled job.
//             const earliestTimestamp = await redis.zrange('scheduledJobs', 0, 0, 'WITHSCORES');
//
//             if (!earliestTimestamp || earliestTimestamp.length === 0) {
//                 // If no jobs are scheduled, wait for a short time and check again.
//                 await new Promise((resolve) => setTimeout(resolve, 1000));
//                 continue;
//             }
//
//             const jobTimestamp = parseFloat(earliestTimestamp[1]);
//             const currentTime = Date.now();
//
//             if (currentTime >= jobTimestamp) {
//                 // If the job's timestamp has arrived, pop and process the job.
//                 const [jobJson] = await redis.zpopmin('scheduledJobs');
//                 const job = JSON.parse(jobJson);
//
//                 // Simulate job processing (replace this with your actual job logic).
//                 console.log(`Processing scheduled job of type '${job.type}' with data:`, job.data);
//
//                 // Simulate job completion (mark the job as completed in a real system).
//                 console.log(`Scheduled job of type '${job.type}' completed.`);
//             } else {
//                 // If the earliest job is in the future, wait until its timestamp arrives.
//                 const waitTime = jobTimestamp - currentTime;
//                 await new Promise((resolve) => setTimeout(resolve, waitTime));
//             }
//         }
//     }
// }
//
//
//
//
//
//
//
//
// // TODO: FUTUTRE
// // // Start a worker process to process scheduled jobs.
// // processScheduledJobs();
// //
// // // Example: Schedule a job to run at a specific date and time.
// // const scheduledTime = new Date('2023-09-06T12:00:00Z'); // Replace with your desired timestamp.
// // scheduleJob('scheduledTask', { message: 'Scheduled task executed!' }, scheduledTime);
// //
// //
// // // cluster EXAMPLE (concurrency)
// // import cluster from 'cluster';
// // import os from 'os';
// //
// // // Define a data structure for a job
// // interface Job {
// //     timestamp: number;
// //     data: any; // Replace 'any' with the specific job data structure
// // }
// //
// // // Master Process (handles job scheduling)
// // if (cluster.isMaster) {
// //     const numWorkers = os.cpus().length; // Create one worker per CPU core
// //
// //     // Fork worker processes
// //     for (let i = 0; i < numWorkers; i++) {
// //         cluster.fork();
// //     }
// //
// //     // Listen for the exit event and restart workers if they crash
// //     cluster.on('exit', (worker) => {
// //         console.log(`Worker ${worker.process.pid} died. Restarting...`);
// //         cluster.fork();
// //     });
// //
// //     // Schedule jobs (replace with your own job scheduling logic)
// //     const currentTime = Date.now();
// //     scheduleJob(currentTime + 1000, { task: 'Job 1' });
// //     scheduleJob(currentTime + 1000, { task: 'Job 2' });
// //     scheduleJob(currentTime + 2000, { task: 'Job 3' });
// //     scheduleJob(currentTime + 2000, { task: 'Job 4' });
// // } else {
// //     // Worker Process (handles job processing)
// //     // A worker process runs this block of code
// //     // Note: You may need to adjust the imports depending on your setup
// //
// //     // A queue to hold scheduled jobs
// //     const jobQueue: Job[] = [];
// //
// //     // Function to execute a job (replace with your actual job processing logic)
// //     function executeJob(job: Job) {
// //         console.log(`Worker ${cluster.worker?.process.pid} is executing job with timestamp ${job.timestamp}`);
// //         // Your job processing logic goes here
// //     }
// //
// //     // Worker-specific job processing logic
// //     function processJobs() {
// //         while (jobQueue.length > 0) {
// //             const job = jobQueue.pop();
// //             if (job) {
// //                 try {
// //                     executeJob(job);
// //                 } catch (error) {
// //                     // Handle errors, you can log them or take appropriate action
// //                     console.error(`Error processing job: ${error}`);
// //                 }
// //             }
// //         }
// //     }
// //
// //     // Worker-specific job scheduling logic
// //     function scheduleJob(timestamp: number, data: any) {
// //         jobQueue.push({ timestamp, data });
// //     }
// //
// //     // Start a worker to process jobs
// //     setInterval(processJobs, 100); // Adjust the interval as needed
// // }
