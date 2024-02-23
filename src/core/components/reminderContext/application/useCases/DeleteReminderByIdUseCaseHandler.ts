import {DeleteReminderByIdUseCase} from "../../../../portsAndInterfaces/ports/DeleteReminderByIdUseCase.js";
import {ReminderService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {SessionActivityService, SessionService} from "../../../userSessionContext/application/services/index.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";

export class DeleteReminderByIdUseCaseHandler extends SessionUpdater implements DeleteReminderByIdUseCase{
    constructor(private reminderService: ReminderService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, id: string): Promise<boolean> {
        this.updateUserSession(viewer, "Delete Reminder");
        return this.reminderService.deleteReminder(viewer, id);
    }

}