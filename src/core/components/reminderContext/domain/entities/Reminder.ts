import {LocationWithRadius} from "./index.js";

export class Reminder {

    constructor(
        public id: string,
        public created: Date,
        public modified: Date,
        public title: string,
        public ownerId: string,
        public idsOfUsersToRemind: string[],
        public isCompleted: boolean,
        public dateTimeToRemind?: Date,
        public locationWithRadius?: LocationWithRadius
    ) {}

    // Method to get a JSON representation of the reminder
    toJSON(): Record<string, any> {
        return {
            id: this.id,
            created: this.created.toISOString(),
            modified: this.modified.toISOString(),
            title: this.title,
            ownerId: this.ownerId,
            idsOfUsersToRemind: JSON.stringify(this.idsOfUsersToRemind),
            isCompleted: JSON.stringify(this.isCompleted),
            dateTimeToRemind: this.dateTimeToRemind ? this.dateTimeToRemind.toISOString() : undefined,
            locationWithRadius: this.locationWithRadius ? this.locationWithRadius.toJSON() : undefined
        };
    }

    // Static method to create a Reminder from a JSON object
    static fromJSON(data: Record<string, any>): Reminder {
        return new Reminder(
            data.id,
            new Date(data.created),
            new Date(data.modified),
            data.title,
            data.ownerId,
            JSON.parse(data.idsOfUsersToRemind),
            JSON.parse(data.isCompleted),
            data.dateTimeToRemind ? new Date(data.dateTimeToRemind) : undefined,
            data.locationWithRadius ? LocationWithRadius.fromJSON(data.locationWithRadius) : undefined
        );
    }

    static isValidReminderData(data: {[p: string]: string}): boolean {
        // Check if all required properties exist
        if(
            data.id &&
            data.created &&
            data.modified &&
            data.title &&
            data.ownerId &&
            data.idsOfUsersToRemind &&
            data.isCompleted
        ){
            // Optional properties are checked here, you can add checks if needed
            return Boolean((data.dateTimeToRemind || data.locationWithRadius));
        }
        return false;
    }

    // Add a subscriber to the reminder
    subscribe(userId: string): void {
        if (!this.idsOfUsersToRemind.includes(userId)) {
            this.idsOfUsersToRemind.push(userId);
        }
    }

    // Remove a subscriber from the reminder
    unsubscribe(userId: string): void {
        const index = this.idsOfUsersToRemind.indexOf(userId);
        if (index !== -1) {
            this.idsOfUsersToRemind.splice(index, 1);
        }
    }

    // Check if a reminder should be triggered based on the current date/time or location
    checkShouldRemind(currentDateTime?: Date, userLocation?: LocationWithRadius): boolean {
        if (this.locationWithRadius) {
            // If a location is specified, check proximity
            if (!userLocation) {
                return false; // Location-based reminder, but user location is not available
            }
            // Trigger the reminder if the user is close enough
            return userLocation.overlaps(this.locationWithRadius);
        } else if (this.dateTimeToRemind){
            if (currentDateTime){
                // Trigger based on date/time if no location is specified
                return currentDateTime >= this.dateTimeToRemind;
            }
            return false; // Time-based reminder, but current time is not available
        }
        return false;
    }

    // Method to snooze the reminder
    snooze(minutes: number): void {
        if (this.dateTimeToRemind){
            // For simplicity, we'll just update the reminder's date and time.
            this.dateTimeToRemind = new Date(this.dateTimeToRemind.getTime() + minutes * 60000);
        }
        else {
            console.log("Can not snooze a location based reminder!");
        }
    }

    // Method to dismiss the reminder
    dismiss(): void {
        // Implement dismiss logic here.
        // For simplicity, we'll just remove the reminder.
        console.log(`Reminder dismissed: ${this.title}`);
    }

    // Method to mark a reminder as completed
    complete(): void {
        if (!this.isCompleted) {
            this.isCompleted = true;
        }
    }

}