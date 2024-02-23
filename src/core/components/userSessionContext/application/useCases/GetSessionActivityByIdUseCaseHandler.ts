import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";
import {SessionActivityService, SessionService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {SessionActivity} from "../../domain/entities/index.js";
import {GetSessionActivityByIdUseCase} from "../../../../portsAndInterfaces/ports/GetSessionActivityByIdUseCase.js";



export class GetSessionActivityByIdUseCaseHandler extends SessionUpdater implements GetSessionActivityByIdUseCase {
    constructor(sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, id: string): Promise<SessionActivity | null> {
        this.updateUserSession(viewer, "Get sessionActivity by id");
        return this.sessionActivityService.generate(viewer, id);
    }

}