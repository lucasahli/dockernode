import {CreateReminderUseCase} from "../../../../portsAndInterfaces/ports/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {ReminderService} from "../services/index.js";
import {CreateReminderResult} from "../../../../portsAndInterfaces/ports/CreateReminderUseCase.js";
import {SessionActivityService, SessionService} from "../../../userSessionContext/application/services/index.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";

export class CreateReminderUseCaseHandler extends SessionUpdater implements CreateReminderUseCase {
    constructor(private reminderService: ReminderService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, title: string, dateTimeToRemind: Date): Promise<CreateReminderResult> {
        this.updateUserSession(viewer, "Create Reminder");
        return this.reminderService.createReminder(viewer, title, dateTimeToRemind);
    }
}