import {SessionStatus} from "../valueObjects/index.js";

export class Session {

    constructor(
        public id: string,
        public created: Date,
        public modified: Date,
        public startTime: Date,
        public sessionStatus: SessionStatus,
        public endTime?: Date,
        public associatedDeviceId?: string,
        public associatedLoginId?: string,
        public associatedRefreshTokenId?: string,
    ) {}

    // Method to get a JSON representation of the reminder
    toJSON(): Record<string, any> {
        return {
            id: this.id,
            created: this.created.toISOString(),
            modified: this.modified.toISOString(),
            startTime: this.startTime.toISOString(),
            sessionStatus: JSON.stringify(this.sessionStatus),
            endTime: this.endTime ? this.endTime.toISOString() : undefined,
            associatedDeviceId: this.associatedDeviceId ? this.associatedDeviceId : undefined,
            associatedLoginId: this.associatedLoginId ? this.associatedLoginId : undefined,
            associatedRefreshTokenId: this.associatedRefreshTokenId ? this.associatedRefreshTokenId : undefined
        };
    }

    // Static method to create a Reminder from a JSON object
    static fromJSON(data: Record<string, any>): Session {
        return new Session(
            data.id,
            new Date(data.created),
            new Date(data.modified),
            new Date(data.startTime),
            data.sessionStatus as SessionStatus,
            data.endTime ? new Date(data.endTime) : undefined,
            data.associatedDeviceId ? data.associatedDeviceId : undefined,
            data.associatedLoginId ? data.associatedLoginId : undefined,
            data.associatedRefreshTokenId ? data.associatedRefreshTokenId : undefined,
        );
    }

    static isValidSessionData(data: {[p: string]: string}): boolean {
        // Check if all required properties exist
        if(
            data.id &&
            data.created &&
            data.modified &&
            data.startTime &&
            data.sessionStatus
        ){
            // Optional properties are checked here, you can add checks if needed
            return true;
        }
        return false;
    }
}