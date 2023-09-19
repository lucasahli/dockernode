
export interface PushNotificationService {
    // Send a push notification to one or more devices.
    sendNotification(
        deviceTokens: string[], // An array of device tokens or registration IDs
        notification: PushNotificationPayload
    ): Promise<PushNotificationResult>;

    // Subscribe a device to a topic (if supported by the service).
    subscribeToTopic(
        deviceToken: string,
        topic: string
    ): Promise<boolean>;

    // Unsubscribe a device from a topic (if supported by the service).
    unsubscribeFromTopic(
        deviceToken: string,
        topic: string
    ): Promise<boolean>;

    // Set up a webhook or callback for receiving delivery status updates.
    setWebhook(url: string): Promise<boolean>;
}

export interface PushNotificationPayload {
    title: string;
    body: string;
    data?: Record<string, any>; // Optional custom data associated with the notification
}

export interface PushNotificationResult {
    success: boolean; // Indicates whether the notification was sent successfully
    error?: string;   // Error message (if the notification failed)
}


