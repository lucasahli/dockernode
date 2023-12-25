import {DeviceType} from "../valueObjects/index.js";

export class Device {

    constructor(
        public id: string,
        public created: Date,
        public modified: Date,
        public deviceIdentifier: string,
        public userAgentString: string,
        public deviceType: DeviceType,
        public deviceName: string, // For example "Tom's iPhone"
        public deviceOperatingSystem: string,
        public lastUsed: Date,
        public associatedSessionIds: string[],
    ) {}

    // Method to get a JSON representation of the reminder
    toJSON(): Record<string, any> {
        return {
            id: this.id,
            created: this.created.toISOString(),
            modified: this.modified.toISOString(),
            deviceIdentifier: this.deviceIdentifier,
            userAgentString: this.userAgentString,
            deviceType: JSON.stringify(this.deviceType),
            deviceName: this.deviceName,
            deviceOperatingSystem: this.deviceOperatingSystem,
            lastUsed: this.lastUsed.toISOString(),
            associatedSessionIds: JSON.stringify(this.associatedSessionIds)
        };
    }

    // Static method to create a Reminder from a JSON object
    static fromJSON(data: Record<string, any>): Device {
        return new Device(
            data.id,
            new Date(data.created),
            new Date(data.modified),
            data.deviceIdentifier,
            data.userAgentString,
            data.deviceType as DeviceType,
            data.deviceName,
            data.deviceOperatingSystem,
            new Date(data.lastUsed),
            data.associatedSessionIds ? JSON.parse(data.associatedSessionIds) : [],
        );
    }

    static isValidDeviceData(data: {[p: string]: string}): boolean {
        // Check if all required properties exist
        if(
            data.id &&
            data.created &&
            data.modified &&
            data.deviceIdentifier &&
            data.userAgentString &&
            data.deviceType &&
            data.deviceName &&
            data.deviceOperatingSystem &&
            data.lastUsed
        ){
            // Optional properties are checked here, you can add checks if needed
            return true;
        }
        return false;
    }
}