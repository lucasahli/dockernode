import {
    GetSessionActivitiesBySessionIdUseCase
} from "../../../../portsAndInterfaces/ports/GetSessionActivitiesBySessionIdUseCase.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";
import {SessionActivityService, SessionService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {SessionActivity} from "../../domain/entities/index.js";


export class GetSessionActivitiesBySessionIdUseCaseHandler extends SessionUpdater implements GetSessionActivitiesBySessionIdUseCase {
    constructor(sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, sessionId: string): Promise<(SessionActivity | Error | null)[]> {
        this.updateUserSession(viewer, "Get sessionActivities by sessionId");
        return this.sessionActivityService.getSessionActivitiesBySessionId(viewer, sessionId);
    }
}