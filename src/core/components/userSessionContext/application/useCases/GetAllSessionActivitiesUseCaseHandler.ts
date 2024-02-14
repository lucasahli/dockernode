import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";
import {SessionActivityService, SessionService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {GetAllSessionActivitiesUseCase} from "../../../../portsAndInterfaces/ports/GetAllSessionActivitiesUseCase.js";
import {SessionActivity} from "../../domain/entities/index.js";



export class GetAllSessionActivitiesUseCaseHandler extends SessionUpdater implements GetAllSessionActivitiesUseCase {
    constructor(sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer): Promise<(SessionActivity | Error | null)[]> {
        this.updateUserSession(viewer, "Get all sessionActivities");
        return this.sessionActivityService.getAllSessionActivities(viewer);
    }
}