export class Reminder {
    id: string;
    title: string;
    dateTimeToRemind: Date;
    ownerId: string;

    constructor(id: string, title: string, dateTimeToRemind: Date, ownerId: string) {
        this.id = id;
        this.title = title;
        this.dateTimeToRemind = dateTimeToRemind;
        this.ownerId = ownerId;
    }
}