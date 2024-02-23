import {GetAllSessionsUseCase} from "../../../../portsAndInterfaces/ports/GetAllSessionsUseCase.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";
import {SessionActivityService, SessionService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Session} from "../../domain/entities/index.js";


export class GetAllSessionsUseCaseHandler extends SessionUpdater implements GetAllSessionsUseCase {
    constructor(sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer): Promise<(Session | Error | null)[]> {
        this.updateUserSession(viewer, "Get all sessions");
        return this.sessionService.getAllSessions(viewer);
    }
}