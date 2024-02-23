import {GetSessionByIdUseCase} from "../../../../portsAndInterfaces/ports/GetSessionByIdUseCase.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";
import {SessionActivityService, SessionService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Session} from "../../domain/entities/index.js";



export class GetSessionByIdUseCaseHandler extends SessionUpdater implements GetSessionByIdUseCase {
    constructor(sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, id: string): Promise<Session | null> {
        this.updateUserSession(viewer, "Get session by id");
        return this.sessionService.generate(viewer, id);
    }

}