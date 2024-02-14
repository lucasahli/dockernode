import {DatabaseError, Viewer} from "../../../../sharedKernel/index.js";
import {DeviceRepository} from "../../../../portsAndInterfaces/interfaces/index.js";
import {Device} from "../../domain/entities/index.js";
import {DeviceType} from "../../domain/valueObjects/index.js";


export class DeviceService {
    private deviceRepository: DeviceRepository;

    constructor(repo: DeviceRepository) {
        this.deviceRepository = repo;
    }

    // Single source of truth for fetching
    async generate(viewer: Viewer, id: string): Promise<Device | null> {
        const device = await this.deviceRepository.getDeviceById(id); // Nullable
        if (device === null) return null;
        const canSee = this.checkCanSee(viewer, device);
        return canSee ? device : null;
    }

    checkCanSee(viewer: Viewer, device: Device): boolean {
        return true;
    }

    async createDevice(
        viewer: Viewer,
        deviceIdentifier: string,
        userAgentString: string,
        deviceType: DeviceType,
        deviceName: string,
        deviceOperatingSystem: string,
        lastUsed: Date,
        associatedSessionIds: string[],
    ): Promise<Device> {
        const canCreate = this.checkCanCreate(viewer);
        const device = await this.deviceRepository.createDevice(
            deviceIdentifier,
            userAgentString,
            deviceType,
            deviceName,
            deviceOperatingSystem,
            lastUsed,
            associatedSessionIds);
        return device;
    }

    checkCanCreate(viewer: Viewer): boolean {
        return true;
    }

    async getAllDevices(viewer: Viewer): Promise<(Device | Error | null)[]> {
        const ids = await this.deviceRepository.getAllDeviceIds();
        if(ids !== null){
            return this.getMany(viewer, ids);
        }
        return [];
    }

    async getMany(viewer: Viewer, ids: string[]): Promise<(Device | Error | null)[]> {
        return Promise.all(ids.map((id) => this.generate(viewer, id)));
    }

    checkCanUpdate(viewer: Viewer, device: Device): boolean {
        if(viewer.isRootUser()){
            return true;
        }
        return true;
    }

    async updateDevice(viewer: Viewer, device: Device): Promise<boolean> {
        const canUpdate = this.checkCanUpdate(viewer, device);
        return canUpdate ? this.deviceRepository.updateDevice(device) : false;
    }

    async getDeviceByDeviceIdentifier(viewer: Viewer, deviceIdentifier: string): Promise<Device | null> {
        const deviceId = await this.deviceRepository.getDeviceIdByDeviceIdentifier(deviceIdentifier);
        if(deviceId){
            return this.generate(viewer, deviceId);
        }
        return null;
    }

    async getOrCreateDeviceFromViewer(viewer: Viewer): Promise<Device> {
        const deviceInfo = viewer.createDeviceInfoFromHeaders();
        if(deviceInfo === undefined) {
            throw new DatabaseError("Could not create new Device Info");
        }
        let device: Device;
        const knownDevice = await this.getDeviceByDeviceIdentifier(viewer, deviceInfo.deviceIdentifier);
        const currentDateTime = new Date(Date.now());
        if(!knownDevice){
            const newDevice = await this.createDevice(
                viewer,
                deviceInfo.deviceIdentifier,
                deviceInfo.userAgentString,
                deviceInfo.deviceType,
                deviceInfo.deviceName,
                deviceInfo.deviceOperatingSystem,
                currentDateTime,
                []
            );
            if(!newDevice){
                throw new DatabaseError("Could not create new Device");
            }
            device = newDevice;
        }
        else {
            device = knownDevice;
        }
        return device;
    }

    async getDeviceBySessionId(viewer: Viewer, sessionId: string) {
        const deviceId = await this.deviceRepository.getDeviceIdBySessionId(sessionId);
        if (deviceId) {
            return this.generate(viewer, deviceId);
        }
        return null;
    }
}