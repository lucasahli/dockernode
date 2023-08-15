import { Reminder } from "../../components/reminderContext/domain/entities/Reminder.js";

export interface ReminderRepository {
  getReminderById(id: string): Promise<Reminder | null>;
  addReminder(title: string, date: Date, ownerId: string): Promise<Reminder>;
  deleteReminder(id: string): Promise<boolean>;
  getRemindersByUser(userId: string): Promise<Reminder[] | null>;
}
