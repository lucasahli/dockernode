import {SessionStatus} from "../valueObjects/index.js";

export class Session {

    constructor(
        public id: string,
        public created: Date,
        public modified: Date,
        public startTime: Date,
        public sessionStatus: SessionStatus,
        public lastActivity: Date,
        public associatedSessionActivities: string[],
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
            sessionStatus: this.sessionStatus, // No stringify for string based enums
            lastActivity: this.lastActivity.toISOString(),
            associatedSessionActivities: JSON.stringify(this.associatedSessionActivities),
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
            new Date(data.lastActivity),
            JSON.parse(data.associatedSessionActivities),
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
            data.sessionStatus &&
            data.lastActivity &&
            data.associatedSessionActivities
        ){
            // Optional properties are checked here, you can add checks if needed
            return true;
        }
        return false;
    }

    isExpired(): boolean {
        const now = new Date();
        const inactivityLimit = 15 * 60 * 1000; // 15 minutes in milliseconds
        const timeSinceLastActivity = now.getTime() - this.lastActivity.getTime();

        return timeSinceLastActivity > inactivityLimit;
    }

    updateLastActivity(): void {
        this.lastActivity = new Date();
        this.modified = new Date();
    }

    equals(otherSession: Session): boolean {
        // Compare each field that defines the equality of two sessions
        return this.id === otherSession.id &&
            this.created.getTime() === otherSession.created.getTime() &&
            this.modified.getTime() === otherSession.modified.getTime() &&
            this.startTime.getTime() === otherSession.startTime.getTime() &&
            JSON.stringify(this.sessionStatus) === JSON.stringify(otherSession.sessionStatus) &&
            this.lastActivity.getTime() === otherSession.lastActivity.getTime() &&
            JSON.stringify(this.associatedSessionActivities) === JSON.stringify(otherSession.associatedSessionActivities) &&
            this.endTime?.getTime() === otherSession.endTime?.getTime() &&
            this.associatedDeviceId === otherSession.associatedDeviceId &&
            this.associatedLoginId === otherSession.associatedLoginId &&
            this.associatedRefreshTokenId === otherSession.associatedRefreshTokenId;
    }

    printDifferences(otherSession: Session): void {
        const differences: string[] = [];

        if (this.id != otherSession.id) differences.push(`id: ${this.id} / ${otherSession.id}`);
        if (this.created.getTime() != otherSession.created.getTime()) differences.push(`created: ${this.created} / ${otherSession.created}`);
        if (this.modified.getTime() != otherSession.modified.getTime()) differences.push(`modified: ${this.modified.toISOString()} / ${otherSession.modified.toISOString()}`);
        if (this.startTime.getTime() != otherSession.startTime.getTime()) differences.push(`startTime: ${this.startTime} / ${otherSession.startTime}`);
        if (JSON.stringify(this.sessionStatus) != JSON.stringify(otherSession.sessionStatus)) differences.push(`sessionStatus: ${JSON.stringify(this.sessionStatus)} / ${JSON.stringify(otherSession.sessionStatus)}`);
        if (this.lastActivity.toISOString() != otherSession.lastActivity.toISOString()) differences.push(`lastActivity: ${this.lastActivity.toISOString()} / ${otherSession.lastActivity.toISOString()}`);
        if (JSON.stringify(this.associatedSessionActivities) != JSON.stringify(otherSession.associatedSessionActivities)) differences.push(`associatedSessionActivityIds: ${JSON.stringify(this.associatedSessionActivities)} / ${JSON.stringify(otherSession.associatedSessionActivities)}`);
        if ((this.endTime && otherSession.endTime && this.endTime.getTime() != otherSession.endTime.getTime()) || (this.endTime && !otherSession.endTime) || (!this.endTime && otherSession.endTime)) {
            differences.push(`endTime: ${this.endTime} / ${otherSession.endTime}`);
        }
        if (this.associatedDeviceId != otherSession.associatedDeviceId) differences.push(`associatedDeviceId: ${this.associatedDeviceId} / ${otherSession.associatedDeviceId}`);
        if (this.associatedLoginId != otherSession.associatedLoginId) differences.push(`associatedLoginId: ${this.associatedLoginId} / ${otherSession.associatedLoginId}`);
        if (this.associatedRefreshTokenId != otherSession.associatedRefreshTokenId) differences.push(`associatedRefreshTokenId: ${this.associatedRefreshTokenId} / ${otherSession.associatedRefreshTokenId}`);

        if (differences.length > 0) {
            console.log('Differences between sessions:');
            differences.forEach(diff => console.log(diff));
        } else {
            console.log('No differences between sessions.');
        }
    }

    addSessionActivity(sessionActivityId: string) {
        this.associatedSessionActivities.push(sessionActivityId);
        this.updateLastActivity();
    }
}