import {Device} from "../../components/userSessionContext/domain/entities/index.js";
import {DeviceType} from "../../components/userSessionContext/domain/valueObjects/index.js";

export interface DeviceRepository {

    //CRUD
    createDevice(
    deviceIdentifier: string,
    userAgentString: string,
    deviceType: DeviceType,
    deviceName: string,
    deviceOperatingSystem: string,
    lastUsed: Date,
    associatedSessionIds: string[]
    ): Promise<Device>
    getDeviceById(id: string): Promise<Device | null>
    updateDevice(updatedDevice: Device): Promise<boolean>
    deleteDevice(id: string): Promise<boolean>

    getAllDeviceIds(): Promise<string[] | null>
    getManyDevicesByIds(ids: string[]): Promise<(Device | Error | null)[]>

    getDeviceIdByDeviceIdentifier(deviceIdentifier: string): Promise<string | null>
}