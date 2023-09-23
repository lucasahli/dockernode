import {ReminderService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Reminder} from "../../domain/entities/index.js";
import {GetRemindersByOwnerIdUseCase} from "../../../../portsAndInterfaces/ports/GetRemindersByOwnerIdUseCase.js";

export class GetRemindersByOwnerIdUseCaseHandler implements GetRemindersByOwnerIdUseCase {
    constructor(private reminderService: ReminderService) {
    }

    execute(viewer: Viewer, ownerId: string): Promise<(Reminder | Error | null)[]> {
        return this.reminderService.getRemindersByOwnerId(viewer, ownerId);
    }
}