import {Viewer} from "../../../sharedKernel/Viewer.js";
import {ReminderUseCase} from "../../../portsAndInterfaces/ports/ReminderUseCase.js";
import {Reminder} from "../domain/entities/Reminder.js";
import {ReminderService} from "../domain/services/ReminderService.js";

export class ReminderUseCaseHandler extends ReminderUseCase {
    private reminderService: ReminderService;

    constructor(service: ReminderService) {
        super();
        this.reminderService = service;
    }

    getReminderById(viewer: Viewer, id: string): Promise<Reminder | null> {
        return ReminderService.generate(viewer, id);
    }

    createReminder(viewer: Viewer, title: string, date: Date): Promise<Reminder | null> {
        return this.reminderService.createReminder(viewer, title, date);
    }

    // getAllReminders(viewer: Viewer): Promise<Reminder[] | null> {
    //     return this.reminderService.getAllReminders(viewer);
    // }

    deleteReminderById(viewer: Viewer, id: string): Promise<boolean> {
        return ReminderService.deleteReminder(viewer, id);
    }

    getRemindersByUser(viewer: Viewer, id: string): Promise<Reminder[] | null> {
        return this.reminderService.getRemindersByUser(viewer, id);
    }
}