import {GetReminderByIdUseCase} from "../../../../portsAndInterfaces/ports/GetReminderByIdUseCase.js";
import {ReminderService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Reminder} from "../../domain/entities/index.js";
import {SessionService} from "../../../userSessionContext/application/services/index.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";
import {SessionActivityService} from "../../../userSessionContext/application/services/SessionActivityService.js";

export class GetReminderByIdUseCaseHandler extends SessionUpdater implements GetReminderByIdUseCase {
    constructor(private reminderService: ReminderService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, id: string): Promise<Reminder | null> {
        this.updateUserSession(viewer, "Get Reminder by Id");
        return this.reminderService.generate(viewer, id);
    }
}