import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";
import {SessionActivityService, SessionService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {GetSessionsByDeviceIdUseCase} from "../../../../portsAndInterfaces/ports/GetSessionsByDeviceIdUseCase.js";
import {Session} from "../../domain/entities/index.js";

export class GetSessionsByDeviceIdUseCaseHandler extends SessionUpdater implements GetSessionsByDeviceIdUseCase {
    constructor(sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, deviceId: string): Promise<(Session | Error | null)[]> {
        this.updateUserSession(viewer, "Get sessions by device");
        return this.sessionService.getSessionsByDeviceId(viewer, deviceId);
    }
}