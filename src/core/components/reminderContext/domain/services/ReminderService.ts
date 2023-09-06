import { Viewer } from "../../../../sharedKernel/Viewer.js";
import { ReminderRepository } from "../../../../portsAndInterfaces/interfaces/ReminderRepository.js";
import { Reminder } from "../entities/Reminder.js";
import {User} from "../entities/index.js";


//
// Static properties and methods are shared by all instances of a class.
//
/*
class Employee {
  static headcount: number = 0;

  constructor(
      private firstName: string,
      private lastName: string,
      private jobTitle: string) {

    Employee.headcount++;
  }
}

let john = new Employee('John', 'Doe', 'Front-end Developer');
let jane = new Employee('Jane', 'Doe', 'Back-end Developer');
console.log(Employee.headcount); // 2

 */

export class ReminderService {
  private reminderRepository: ReminderRepository;

  constructor(repo: ReminderRepository) {
    this.reminderRepository = repo;
  }

  // Single source of truth for fetching
  async generate(viewer: Viewer, id: string): Promise<Reminder | null> {
    const reminder = await this.reminderRepository.getReminderById(id); // Nullable
    if (reminder === null) return null;
    const canSee = this.checkCanSee(viewer, reminder);
    return canSee ? reminder : null;
  }

  checkCanSee(viewer: Viewer, reminder: Reminder): boolean {
    return true;
  }

  async createReminder(
    viewer: Viewer,
    title: string,
    dateTimeToRemind: Date
  ): Promise<Reminder | null> {
    const ownerId = viewer.userId;
    if (ownerId === undefined){
      return null;
    }
    const possibleReminder = await this.reminderRepository
      .addReminder(title, dateTimeToRemind, ownerId)
      .then((reminder) => {
        return reminder;
      })
      .catch((error) => {
        console.log(
          "Could not add new reminder --> Should return error: ",
          error
        );
        return null;
      });
    let canCreateReminder = ReminderService.checkCanCreate(
      viewer,
      title,
        dateTimeToRemind,
      possibleReminder
    );
    if (!canCreateReminder) return null;
    return possibleReminder;
  }

  static checkCanCreate(
    viewer: Viewer,
    title: string,
    dateTimeToRemind: Date,
    potentialReminder: any
  ): boolean {
    console.log("CheckCanCreate: ", potentialReminder);
    return viewer.isLoggedIn();
  }

  async deleteReminder(viewer: Viewer, id: string): Promise<boolean> {
    const reminderToDelete = await this.reminderRepository
      .getReminderById(id)
      .then((result) => {
        return result;
      })
      .catch((reason) => {
        if (reason.message == "Cannot read property 'id' of null") {
          console.log("Can not find reminder with this id...");
        }
        return null;
      });
    if (reminderToDelete === null) return false;
    const canDelete = this.checkCanDelete(viewer, reminderToDelete);
    return canDelete
      ? this.reminderRepository.deleteReminder(id)
      : false;
  }

  checkCanDelete(viewer: Viewer, reminder: Reminder): boolean {
    if(viewer.isLoggedIn()){
      return viewer.userId == reminder.ownerId;
    }
    return false;
  }

  async getRemindersByUserId(viewer: Viewer, userId: string): Promise<(Reminder | Error | null)[]> {
    const ids = await this.reminderRepository.getReminderIdsByOwnerId(userId);
    if(ids !== null){
      return this.getMany(viewer, ids);
    }
    return [];
  }

  async getAllReminders(viewer: Viewer): Promise<(Reminder | Error | null)[]> {
    const ids = await this.reminderRepository.getAllReminderIds();
    if(ids !== null){
      return this.getMany(viewer, ids);
    }
    return [];
  }

  async getMany(viewer: Viewer, reminderIds: string[]): Promise<(Reminder | Error | null)[]> {
    return Promise.all(reminderIds.map((id) => this.generate(viewer, id)));
  }

}
