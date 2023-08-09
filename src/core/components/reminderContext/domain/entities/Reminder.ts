export class Reminder {
    id: string;
    title: string;
    date: Date;
    ownerId: string;

    constructor(id: string, title: string, date: Date, ownerId: string) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.ownerId = ownerId;
    }
}