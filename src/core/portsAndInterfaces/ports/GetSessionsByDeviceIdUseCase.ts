import {Viewer} from "../../sharedKernel/index.js";
import {Session} from "../../components/userSessionContext/domain/entities/index.js";

export interface GetSessionsByDeviceIdUseCase {
    execute(viewer: Viewer, deviceId: string): Promise<(Session | Error | null)[]>;
}