import {GetDeviceBySessionIdUseCase} from "../../../../portsAndInterfaces/ports/GetDeviceBySessionIdUseCase.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";
import {DeviceService, SessionActivityService, SessionService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Device} from "../../domain/entities/index.js";



export class GetDeviceBySessionIdUseCaseHandler extends SessionUpdater implements GetDeviceBySessionIdUseCase {
    constructor(private deviceService: DeviceService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, sessionId: string): Promise<Device | null> {
        this.updateUserSession(viewer, "Get device by sessionId");
        return this.deviceService.getDeviceBySessionId(viewer, sessionId);
    }
}