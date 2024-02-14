import {GetRemindersByOwnerUseCase} from "../../../../portsAndInterfaces/ports/GetRemindersByOwnerUseCase.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Error} from "sequelize";
import {Reminder} from "../../domain/entities/index.js";
import {ReminderService} from "../services/index.js";
import {SessionActivityService, SessionService} from "../../../userSessionContext/application/services/index.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";

export class GetRemindersByOwnerUseCaseHandler extends SessionUpdater implements GetRemindersByOwnerUseCase {
    constructor(private reminderService: ReminderService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, id: string): Promise<(Reminder | Error | null)[]> {
        this.updateUserSession(viewer, "Get reminder by owner");
        return this.reminderService.getRemindersByOwnerId(viewer, id);
    }

}