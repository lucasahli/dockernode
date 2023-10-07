import {CreateReminderUseCase} from "../../../../portsAndInterfaces/ports/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Reminder} from "../../domain/entities/index.js";
import {ReminderService} from "../services/index.js";
import {CreateReminderResult} from "../../../../portsAndInterfaces/ports/CreateReminderUseCase.js";

export class CreateReminderUseCaseHandler implements CreateReminderUseCase {
    constructor(private reminderService: ReminderService) {
    }

    execute(viewer: Viewer, title: string, dateTimeToRemind: Date): Promise<CreateReminderResult> {
        return this.reminderService.createReminder(viewer, title, dateTimeToRemind);
    }
}