import {DeleteReminderByIdUseCase} from "../../../../portsAndInterfaces/ports/DeleteReminderByIdUseCase.js";
import {ReminderService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";

export class DeleteReminderByIdUseCaseHandler implements DeleteReminderByIdUseCase{
    constructor(private reminderService: ReminderService) {
    }

    execute(viewer: Viewer, id: string): Promise<boolean> {
        return this.reminderService.deleteReminder(viewer, id);
    }

}