import { Reminder } from "../../components/reminderContext/domain/entities/Reminder.js";

export interface ReminderRepository {
  getReminderById(id: string): Promise<Reminder | null>;
  addReminder(title: string, date: Date, ownerId: string): Promise<Reminder>;
  deleteReminder(id: string): Promise<boolean>;

  getReminderIdsByOwnerId(ownerId: string): Promise<string[]>;
  getAllReminderIds(): Promise<string[] | null>;
}
