import {
    PushNotificationPayload,
    PushNotificationResult,
    PushNotificationService
} from "../../core/portsAndInterfaces/interfaces/index.js";

// import * as admin from 'firebase-admin';
import admin, {credential} from 'firebase-admin';
import {initializeApp} from "firebase-admin/app";
// import serviceAccount from './../../firebaseServiceAccountKey.json' assert { type: 'json' };



export class FirebaseCloudMessagingNotificationService implements PushNotificationService {

    private firebaseAdmin: admin.app.App;

    constructor() {
        // Initialize the Firebase Admin SDK
        // import("../../firebaseServiceAccountKey.json").then((module) => {
        //     const serviceAccountJson = module.default;
        //     console.log(serviceAccountJson);
        //     const serviceAccount = serviceAccountJson as admin.ServiceAccount;
        //
        //     admin.initializeApp({
        //         credential: admin.credential.cert(serviceAccount),
        //     });
        // }).catch(error => {
        //     console.error(error);
        // });

        // export interface ServiceAccount {
        //     projectId?: string;
        //     clientEmail?: string;
        //     privateKey?: string;
        // }

        //snake_case to camelCase
        // const params = {
        //     type: serviceAccount.type,
        //     projectId: serviceAccount.project_id,
        //     privateKeyId: serviceAccount.private_key_id,
        //     privateKey: serviceAccount.private_key,
        //     clientEmail: serviceAccount.client_email,
        //     clientId: serviceAccount.client_id,
        //     authUri: serviceAccount.auth_uri,
        //     tokenUri: serviceAccount.token_uri,
        //     authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
        //     clientC509CertUrl: serviceAccount.client_x509_cert_url
        // }

        // this.firebaseAdmin = admin.initializeApp({
        //     credential: admin.credential.cert(params)
        // });

        // Check if the environment variable is set
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            throw new Error('The GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
        }

        // Parse the service account JSON string into an object
        // const base64String = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        // const jsonString = Buffer.from(base64String, 'base64').toString('utf-8');
        // const serviceAccount = JSON.parse(jsonString);


        // const result = admin.credential.cert(serviceAccount as admin.ServiceAccount);

        // Initialize Firebase Admin SDK using environment variables
        // Locally (for development): You can set the GOOGLE_APPLICATION_CREDENTIALS environment
        // variable to the path of your service account JSON file:
        // GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"

        this.firebaseAdmin = admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });

        // serviceAccount as admin.ServiceAccount
        // admin.credential.cert(serviceAccount as admin.ServiceAccount)

    }

    // Function to send a push notification
    private async sendPushNotification(deviceToken: string, messageTitle: string, messageBody: string) {
        const message = {
            notification: {
                title: messageTitle,
                body: messageBody,
            },
            token: deviceToken,
        };

        try {
            // const params = {
            //     type: serviceAccount.type,
            //     projectId: serviceAccount.project_id,
            //     privateKeyId: serviceAccount.private_key_id,
            //     privateKey: serviceAccount.private_key,
            //     clientEmail: serviceAccount.client_email,
            //     clientId: serviceAccount.client_id,
            //     authUri: serviceAccount.auth_uri,
            //     tokenUri: serviceAccount.token_uri,
            //     authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
            //     clientC509CertUrl: serviceAccount.client_x509_cert_url
            // }
            //
            // this.firebaseAdmin = admin.initializeApp({
            //     credential: admin.credential.cert(params)
            // });
            const response = await this.firebaseAdmin.messaging().send(message);
            console.log('Successfully sent message:', response);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    async sendNotification(deviceTokens: string[], notification: PushNotificationPayload): Promise<PushNotificationResult> {
        for (const deviceToken of deviceTokens) {
            if (deviceToken != "userAgentString"){
                console.log(`Sending Push Notification to ${deviceToken} with title: ${notification.title}`);
                await this.sendPushNotification(deviceToken, `${notification.title}`, `${notification.body}`);
            }
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