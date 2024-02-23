import {
    PushNotificationPayload,
    PushNotificationResult,
    PushNotificationService
} from "../../core/portsAndInterfaces/interfaces/index.js";
import {Console} from "inspector";

export class MyPushNotificationService implements PushNotificationService {
    sendNotification(deviceTokens: string[], notification: PushNotificationPayload): Promise<PushNotificationResult> {
        for (const deviceToken of deviceTokens) {
            console.log(`Sending Push Notification to ${deviceToken} with title: ${notification.title}`);
        }
        return Promise.resolve({success: true});
    }

    setWebhook(url: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    subscribeToTopic(deviceToken: string, topic: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    unsubscribeFromTopic(deviceToken: string, topic: string): Promise<boolean> {
        return Promise.resolve(false);
    }

}