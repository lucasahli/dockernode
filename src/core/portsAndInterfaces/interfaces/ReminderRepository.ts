import {Reminder} from "../../components/reminderContext/domain/entities/Reminder.js";

export abstract class ReminderRepository {
    abstract getReminderById(id: string): Promise<Reminder | null>
    abstract addReminder(title: string, date: Date, ownerId: string): Promise<Reminder>
    abstract deleteReminder(id: string): Promise<boolean>
    abstract getRemindersByUser(userId: string): Promise<Reminder[] | null>
}