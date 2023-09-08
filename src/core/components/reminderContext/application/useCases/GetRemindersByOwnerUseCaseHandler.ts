import {GetRemindersByOwnerUseCase} from "../../../../portsAndInterfaces/ports/GetRemindersByOwnerUseCase.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Error} from "sequelize";
import {Reminder} from "../../domain/entities/index.js";
import {ReminderService} from "../services/index.js";

export class GetRemindersByOwnerUseCaseHandler implements GetRemindersByOwnerUseCase {
    constructor(private reminderService: ReminderService) {
    }

    execute(viewer: Viewer, id: string): Promise<(Reminder | Error | null)[]> {
        return this.reminderService.getRemindersByOwnerId(viewer, id);
    }

}