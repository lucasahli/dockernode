import {Viewer} from "../../sharedKernel/index.js";
import {Device} from "../../components/userSessionContext/domain/entities/index.js";


export interface GetDeviceBySessionIdUseCase {
    execute(viewer: Viewer, sessionId: string): Promise<Device | null>;
}