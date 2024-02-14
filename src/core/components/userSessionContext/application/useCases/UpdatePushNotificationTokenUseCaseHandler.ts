import {DeviceService, SessionActivityService, SessionService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {
    UpdatePushNotificationTokenUseCase
} from "../../../../portsAndInterfaces/ports/UpdatePushNotificationTokenUseCase.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";

export class UpdatePushNotificationTokenUseCaseHandler extends SessionUpdater implements UpdatePushNotificationTokenUseCase {
    constructor(private deviceService: DeviceService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    async execute(viewer: Viewer, pushNotificationToken: string): Promise<Boolean> {
        this.updateUserSession(viewer, "Update Push Notification Token");
        try {
            const device = await this.deviceService.getOrCreateDeviceFromViewer(viewer);
            device.deviceIdentifier = pushNotificationToken;
            return await this.deviceService.updateDevice(viewer, device);
        } catch (reason) {
            return false;
        }
    }
}