import {ReminderService} from "./index.js";
// TODO: Change Dependencies --> no context interference!
import {DeviceService, LoginService, UserService} from "../../../userSessionContext/application/services/index.js"
import {LocationWithRadius, Reminder} from "../../domain/entities/index.js";
import {PushNotificationPayload, PushNotificationService} from "../../../../portsAndInterfaces/interfaces/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";


export class ReminderNotificationService {

    constructor(
        private reminderService: ReminderService,
        private userService: UserService,
        private loginService: LoginService,
        private deviceService: DeviceService,
        private pushNotificationService: PushNotificationService
    ) {}

    // Check reminders and send push notifications if they should be triggered
    async checkDateTimeBasedRemindersForNotifications(currentDateTime: Date) {
        // TODO: Improve --> Do not get all reminders (better performance)
        const allReminders = await this.reminderService.getAllReminders(Viewer.Root());

        for (const reminder of allReminders) {
            if (reminder instanceof Reminder){
                if(!reminder.isCompleted && reminder.checkShouldRemind(currentDateTime, undefined)){
                    // Trigger the reminder
                    console.log("should send notification for: ", reminder.title);
                    await this.sendTimeBasedPushNotification(reminder);
                }
            }
        }
    }

    // Simulate sending a push notification (replace with actual implementation)
    private async sendTimeBasedPushNotification(reminder: Reminder): Promise<void> {
        for (const userId of reminder.idsOfUsersToRemind) {
            const user = await this.userService.generate(Viewer.Root(), userId);
            if (user){
                console.log("Has User");
                const deviceTokens: string[] = [];
                const login = await this.loginService.generate(Viewer.Root(), user.associatedLoginId);
                if(login){
                    console.log("Has Login: ", login);
                    for (const deviceId of login.associatedDeviceIds) {
                        console.log("Has Device ", deviceId);
                        const device = await this.deviceService.generate(Viewer.Root(), deviceId);
                        if (device) {
                            console.log(device.deviceIdentifier);
                            deviceTokens.push(device.deviceIdentifier);
                        }
                    }
                }
                // TODO: Implement Device Tokens for Notifications
                const payload: PushNotificationPayload = {title: `${reminder.title}`, body: `Do it now!`};
                const pushNotificationResult = await this.pushNotificationService.sendNotification(deviceTokens, payload);
                // console.log(`Push notification sent for reminder: ${reminder.title}`);
                // console.log(`Push notification sent to user: ${user.id}`);

                reminder.complete();
                const success = await this.reminderService.updateReminder(Viewer.Root(), reminder);
            }
            else {
                console.log("user not found with Id: ", userId);
            }
        }
    }
}