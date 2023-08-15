import {Viewer} from "../../../../sharedKernel/Viewer.js";
import {ReminderRepository} from "../../../../portsAndInterfaces/interfaces/ReminderRepository.js";
import {Reminder} from "../entities/Reminder.js";


export class ReminderService {
    private static reminderRepository: ReminderRepository;

    constructor(repo: ReminderRepository) {
        ReminderService.reminderRepository = repo;
    }

    // Single source of truth for fetching
    static async generate(viewer: Viewer, id: string): Promise<Reminder | null> {
        const reminder = await this.reminderRepository.getReminderById(id); // Nullable
        if(reminder === null) return null;
        const canSee = this.checkCanSee(viewer, reminder);
        return canSee ? reminder : null;
    }

    private static checkCanSee(viewer: Viewer, reminder: Reminder): boolean {
        return viewer.hasValidToken() || true;
    }

    async createReminder(viewer: Viewer, title: string, date: Date): Promise<Reminder | null> {
        const ownerId = viewer.userId;
        const possibleReminder = await ReminderService.reminderRepository.addReminder(title, date, ownerId)
            .then((reminder) => {
                return reminder;
            })
            .catch((error) => {
                console.log("Could not add new reminder --> Should return error: ", error);
                return null
            })
        let canCreateReminder = ReminderService.checkCanCreate(viewer, title, date, possibleReminder);
        if(!canCreateReminder) return null;
        return possibleReminder;
    }

    private static checkCanCreate(viewer: Viewer, title: string, date: Date, potentialReminder: any): boolean {
        console.log("CheckCanCreate: ", potentialReminder);
        return true;
    }

    static async deleteReminder(viewer: Viewer, id: string): Promise<boolean> {
        const reminderToDelete = await this.reminderRepository.getReminderById(id)
            .then((result) => {
                return result;
            }).catch((reason) => {
                if(reason.message == "Cannot read property 'id' of null") {
                    console.log("Can not find reminder with this id...")
                }
                return null;
            });
        if(reminderToDelete === null) return false;
        const canDelete = this.checkCanDelete(viewer, reminderToDelete);
        return canDelete ? ReminderService.reminderRepository.deleteReminder(id) : false;
    }

    private static checkCanDelete(viewer: Viewer, reminder: Reminder): boolean {
        return true;
    }

    getRemindersByUser(viewer: Viewer, id: string): Promise<Reminder[] | null> {
        return ReminderService.reminderRepository.getRemindersByUser(id);
    }
}