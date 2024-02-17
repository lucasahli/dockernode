import {GetSessionBySessionActivityIdUseCase} from "../../../../portsAndInterfaces/ports/GetSessionBySessionActivityIdUseCase.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";
import {SessionActivityService, SessionService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Session} from "../../domain/entities/index.js";


export class GetSessionBySessionActivityIdUseCaseHandler extends SessionUpdater implements GetSessionBySessionActivityIdUseCase {
    constructor(sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, sessionActivityId: string): Promise<Session | null> {
        this.updateUserSession(viewer, "Get session by sessionActivity");
        return this.sessionService.getSessionBySessionActivityId(viewer, sessionActivityId);
    }
}