import {ReminderService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Reminder} from "../../domain/entities/index.js";
import {GetRemindersByOwnerIdUseCase} from "../../../../portsAndInterfaces/ports/index.js";
import {SessionActivityService, SessionService} from "../../../userSessionContext/application/services/index.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";

export class GetRemindersByOwnerIdUseCaseHandler extends SessionUpdater implements GetRemindersByOwnerIdUseCase {
    constructor(private reminderService: ReminderService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, ownerId: string): Promise<(Reminder | Error | null)[]> {
        this.updateUserSession(viewer, "Get reminders by owner");
        return this.reminderService.getRemindersByOwnerId(viewer, ownerId);
    }
}