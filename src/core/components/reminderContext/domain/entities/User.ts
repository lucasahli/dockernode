import {UserRole} from "../../../../sharedKernel/UserRole.js";

export class User {

    constructor(
        public id: string,
        public created: Date,
        public modified: Date,
        public associatedLoginId: string,
        public role: UserRole,
        public fullName: string) {}

    // Method to get a JSON representation of the reminder
    toJSON(): Record<string, any> {
        return {
            id: this.id,
            created: this.created.toISOString(),
            modified: this.modified.toISOString(),
            associatedLoginId: this.associatedLoginId,
            role: JSON.stringify(this.role),
            fullName: this.fullName
        };
    }

    // Static method to create a Reminder from a JSON object
    static fromJSON(data: Record<string, any>): User {
        return new User(
            data.id,
            new Date(data.created),
            new Date(data.modified),
            data.associatedLoginId,
            data.role as UserRole,
            data.fullName
        );
    }

    static isValidUserData(data: {[p: string]: string}): boolean {
        // Check if all required properties exist
        if(
            data.id &&
            data.created &&
            data.modified &&
            data.associatedLoginId &&
            data.role &&
            data.fullName
        ){
            // Optional properties are checked here, you can add checks if needed
            return true;
        }
        return false;
    }
}