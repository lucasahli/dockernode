import {ReminderService} from "./index.js";
import {LocationWithRadius, Reminder} from "../../domain/entities/index.js";


class ReminderNotificationService {
    private reminderService: ReminderService;

    constructor(reminderService: ReminderService) {
        this.reminderService = reminderService;
    }

    // Check reminders and send push notifications if they should be triggered
    async checkRemindersForNotifications(currentDateTime: Date, userLocation: LocationWithRadius | null) {
        // TODO: Improve --> Do not get all reminders (better performance)
        const allReminders = await this.reminderService.getAllReminders(); // TODO: Add Viewer or change something

        for (const reminder of allReminders) {
            if (reminder instanceof Reminder){
                if(reminder.checkShouldRemind(currentDateTime, userLocation)){
                    // Trigger the reminder
                    this.sendPushNotification(reminder);
                }
            }
        }
    }

    // Simulate sending a push notification (replace with actual implementation)
    private sendPushNotification(reminder: Reminder): void {
        console.log(`Push notification sent for reminder: ${reminder.title}`);
        // Implement the logic to send push notifications here
    }
}