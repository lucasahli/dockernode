import {DeviceType} from "./DeviceType.js";

export class DeviceInfo {

    constructor(
        public deviceIdentifier: string,
        public userAgentString: string,
        public deviceType: DeviceType,
        public deviceName: string, // For example "Tom's iPhone"
        public deviceOperatingSystem: string,
    ) {}
}