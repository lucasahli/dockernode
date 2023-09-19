import {
    PushNotificationPayload,
    PushNotificationResult,
    PushNotificationService
} from "../../core/portsAndInterfaces/interfaces/index.js";
import {Console} from "inspector";

export class MyPushNotificationService implements PushNotificationService {
    sendNotification(deviceTokens: string[], notification: PushNotificationPayload): Promise<PushNotificationResult> {
        console.log('Sending Push Notification...')
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