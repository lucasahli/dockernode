import {Viewer} from "../../sharedKernel/Viewer.js";
import {Reminder} from "../../components/reminderContext/domain/entities/Reminder.js";
import {User} from "../../components/reminderContext/domain/entities/index.js";

export interface ReminderUseCase {
    createReminder(viewer: Viewer, title: string, dateTimeToRemind: Date): Promise<Reminder | null>
    getReminderById(viewer: Viewer, id: string): Promise<Reminder | null>
    deleteReminderById(viewer: Viewer, id: string): Promise<boolean>
    getRemindersByUser(viewer: Viewer, id: string): Promise<(Reminder | Error | null)[]>
    getAllReminders(viewer: Viewer): Promise<(Reminder | Error | null)[]>
}