import {GetReminderByIdUseCase} from "../../../../portsAndInterfaces/ports/GetReminderByIdUseCase.js";
import {ReminderService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Reminder} from "../../domain/entities/index.js";

export class GetReminderByIdUseCaseHandler implements GetReminderByIdUseCase {
    constructor(private reminderService: ReminderService) {
    }

    execute(viewer: Viewer, id: string): Promise<Reminder | null> {
        return this.reminderService.generate(viewer, id);
    }
}