import { Reminder } from "../../components/reminderContext/domain/entities/Reminder.js";
import {LocationWithRadius} from "../../components/reminderContext/domain/entities/index.js";

export interface ReminderRepository {
  getReminderById(id: string): Promise<Reminder | null>;

  createReminder(title: string, ownerId: string, idsOfUsersToRemind: string[], isCompleted: boolean, dateTimeToRemind?: Date, locationWithRadius?: LocationWithRadius): Promise<Reminder>;
  deleteReminder(id: string): Promise<boolean>;

  getReminderIdsByOwnerId(ownerId: string): Promise<string[]>;
  getAllReminderIds(): Promise<string[] | null>;

  updateReminder(reminder: Reminder): Promise<boolean>;
}
