import {SessionStatus} from "../valueObjects/index.js";

export class SessionActivity {
    constructor(
        public id: string,
        public created: Date,
        public modified: Date,
        public description: string,
        public associatedSessionId: string,
    ) {}

    // Method to get a JSON representation of the reminder
    toJSON(): Record<string, any> {
        return {
            id: this.id,
            created: this.created.toISOString(),
            modified: this.modified.toISOString(),
            description: this.description,
            associatedSessionId: this.associatedSessionId
        };
    }

    // Static method to create a Reminder from a JSON object
    static fromJSON(data: Record<string, any>): SessionActivity {
        return new SessionActivity(
            data.id,
            new Date(data.created),
            new Date(data.modified),
            data.description,
            data.associatedSessionId,
        );
    }

    static isValidSessionData(data: {[p: string]: string}): boolean {
        // Check if all required properties exist
        if(
            data.id &&
            data.created &&
            data.modified &&
            data.description &&
            data.associatedSessionId
        ){
            // Optional properties are checked here, you can add checks if needed
            return true;
        }
        return false;
    }
}