import {InitializePeriodicReminderChecksUseCase} from "../../../../portsAndInterfaces/ports/index.js";
import {ReminderNotificationService} from "../services/index.js";
import {JobScheduler} from "../../../../portsAndInterfaces/interfaces/index.js";

export class InitializePeriodicReminderChecksUseCaseHandler implements InitializePeriodicReminderChecksUseCase {
    constructor(private jobScheduler: JobScheduler ,private reminderNotificationService: ReminderNotificationService) {}

    execute(): Promise<void> {
        this.jobScheduler.startTimedJob(1000, () => {
            const currentDateTime = new Date();
            this.reminderNotificationService.checkDateTimeBasedRemindersForNotifications(currentDateTime)
                .then(() => {
                    // console.log("Checked Reminders at: ", currentDateTime.toISOString())
                })
                .catch(() => console.error("Failed to check Reminders!!!"));
        })
        return Promise.resolve(undefined);
    }

}