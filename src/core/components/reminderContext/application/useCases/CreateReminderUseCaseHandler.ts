import {CreateReminderUseCase} from "../../../../portsAndInterfaces/ports/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Reminder} from "../../domain/entities/index.js";
import {ReminderService} from "../services/index.js";

export class CreateReminderUseCaseHandler implements CreateReminderUseCase {
    constructor(private reminderService: ReminderService) {
    }

    execute(viewer: Viewer, title: string, dateTimeToRemind: Date): Promise<Reminder | null> {
        return this.reminderService.createReminder(viewer, title, dateTimeToRemind);
        // TODO: Start Subscription for this reminder
        // TODO: Start Reminder Task
    }
}