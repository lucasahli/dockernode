import {GetAllRemindersUseCase} from "../../../../portsAndInterfaces/ports/GetAllRemindersUseCase.js";
import {ReminderService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Reminder} from "../../domain/entities/index.js";

export class GetAllRemindersUseCaseHandler implements GetAllRemindersUseCase {
    constructor(private reminderService: ReminderService) {
    }

    execute(viewer: Viewer): Promise<(Reminder | Error | null)[]> {
        return this.reminderService.getAllReminders(viewer);
    }
}