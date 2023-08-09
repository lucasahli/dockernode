import {Viewer} from "../../sharedKernel/Viewer.js";
import {Reminder} from "../../components/reminderContext/domain/entities/Reminder.js";

export abstract class ReminderUseCase {
    abstract createReminder(viewer: Viewer, title: string, date: Date): Promise<Reminder | null>
    abstract getReminderById(viewer: Viewer, id: string): Promise<Reminder | null>
    abstract deleteReminderById(viewer: Viewer, id: string): Promise<boolean>
    abstract getRemindersByUser(viewer: Viewer, id: string): Promise<Reminder[] | null>
}