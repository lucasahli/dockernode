import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";
import {DeviceService, SessionActivityService, SessionService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Device} from "../../domain/entities/index.js";
import {GetDeviceByIdUseCase} from "../../../../portsAndInterfaces/ports/GetDeviceByIdUseCase.js";



export class GetDeviceByIdUseCaseHandler extends SessionUpdater implements GetDeviceByIdUseCase {
    constructor(private deviceService: DeviceService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, id: string): Promise<Device | null> {
        this.updateUserSession(viewer, "Get device by id");
        return this.deviceService.generate(viewer, id);
    }

}