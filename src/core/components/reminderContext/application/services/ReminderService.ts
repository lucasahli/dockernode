import {Viewer} from "../../../../sharedKernel/Viewer.js";
import {ReminderRepository} from "../../../../portsAndInterfaces/interfaces/ReminderRepository.js";
import {Reminder} from "../../domain/entities/Reminder.js";
import {
  CreateReminderInvalidInput,
  CreateReminderInvalidInputField,
  CreateReminderProblem,
  CreateReminderResult
} from "../../../../portsAndInterfaces/ports/CreateReminderUseCase.js";
import {SignUpInvalidInput, SignUpInvalidInputField} from "../../../../portsAndInterfaces/ports/SignUpUseCase.js";


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
  ): Promise<CreateReminderResult> {
    const createReminderProblem = this.checkCanCreate(viewer, title, dateTimeToRemind);
    if(createReminderProblem instanceof CreateReminderProblem) return createReminderProblem;
    const reminder = await this.reminderRepository.createReminder(title, viewer.userId!, [viewer.userId!], false, dateTimeToRemind);
    return {createdReminder: reminder};
  }

  checkCanCreate(viewer: Viewer, reminderTitle: string, dateTimeToRemind: Date): CreateReminderProblem | undefined {
    const ownerId = viewer.userId;
    if (ownerId === undefined){
      return new CreateReminderProblem("Not signed in: Sign in to create a reminder", []);
    }
    const invalidInputs: CreateReminderInvalidInput[] = [];
    if(!reminderTitle) invalidInputs.push({
      field: CreateReminderInvalidInputField.TITLE,
      message: "No reminder title was provided: A reminder needs a title",
    });
    if(!dateTimeToRemind) invalidInputs.push({
      field: CreateReminderInvalidInputField.DATETIME,
      message: "DateTime is missing: Set a date and time to be reminded",
    });
    if(dateTimeToRemind.getTime() < Date.now()) invalidInputs.push({
      field: CreateReminderInvalidInputField.DATETIME,
      message: "DateTime is in the past: Set a date and time in the future",
    });

    if(invalidInputs.length > 0){
      return new CreateReminderProblem("Could not create reminder", invalidInputs);
    }
    return undefined;
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
    try {
      const isLoggedIn = viewer.isLoggedIn();
      if(isLoggedIn){
        const userId: string = viewer.userId ?? "";
        return (userId === reminder.ownerId);
      }
      else {
        return false;
      }
    }
    catch (e) {
      console.log("Error", e);
      return false;
    }
  }

  async getRemindersByOwnerId(viewer: Viewer, ownerId: string): Promise<(Reminder | Error | null)[]> {
    const ids = await this.reminderRepository.getReminderIdsByOwnerId(ownerId);
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

  checkCanUpdate(viewer: Viewer, reminder: Reminder): boolean {
    if(viewer.isRootUser()){
      return true;
    }
    return viewer.isLoggedIn() && reminder.ownerId === viewer.userId;
  }

  async updateReminder(viewer: Viewer, reminder: Reminder): Promise<boolean> {
    const canUpdate = this.checkCanUpdate(viewer, reminder);
    return canUpdate ? this.reminderRepository.updateReminder(reminder) : false;
  }

}
