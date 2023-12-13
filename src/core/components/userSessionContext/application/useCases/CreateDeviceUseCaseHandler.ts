import {Viewer} from "../../../../sharedKernel/index.js";
import {CreateDeviceUseCase} from "../../../../portsAndInterfaces/ports/CreateDeviceUseCase.js";
import {Device} from "../../domain/entities/index.js";
import {DeviceService} from "../services/index.js";


export class CreateDeviceUseCaseHandler implements CreateDeviceUseCase {
    constructor(private deviceService: DeviceService) {
    }

    execute(viewer: Viewer): Promise<Device> {
        const dateTimeNow = new Date(Date.now());
        const deviceInfo = viewer.createDeviceInfoFromHeaders()
        if(deviceInfo){
            return this.deviceService.createDevice(
                viewer,
                deviceInfo.deviceIdentifier,
                deviceInfo.userAgentString,
                deviceInfo.deviceType,
                deviceInfo.deviceName,
                deviceInfo.deviceOperatingSystem,
                new Date(Date.now()),
                []);
        }
        else {
            return Promise.reject("No device info was created");
        }
    }
}