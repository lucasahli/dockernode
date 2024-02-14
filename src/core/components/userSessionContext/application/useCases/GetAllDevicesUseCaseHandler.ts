import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";
import {DeviceService, SessionActivityService, SessionService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Device} from "../../domain/entities/index.js";
import {GetAllDevicesUseCase} from "../../../../portsAndInterfaces/ports/GetAllDevicesUseCase.js";



export class GetAllDevicesUseCaseHandler extends SessionUpdater implements GetAllDevicesUseCase {
    constructor(private deviceService: DeviceService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer): Promise<(Device | Error | null)[]> {
        this.updateUserSession(viewer, "Get all devices");
        return this.deviceService.getAllDevices(viewer);
    }
}