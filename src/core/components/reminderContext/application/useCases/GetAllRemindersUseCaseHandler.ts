import {GetAllRemindersUseCase} from "../../../../portsAndInterfaces/ports/GetAllRemindersUseCase.js";
import {ReminderService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Reminder} from "../../domain/entities/index.js";
import {SessionActivityService, SessionService} from "../../../userSessionContext/application/services/index.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";

export class GetAllRemindersUseCaseHandler extends SessionUpdater implements GetAllRemindersUseCase {
    constructor(private reminderService: ReminderService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer): Promise<(Reminder | Error | null)[]> {
        this.updateUserSession(viewer, "Get All Reminders");
        return this.reminderService.getAllReminders(viewer);
    }
}