import {Viewer} from "../../sharedKernel/index.js";
import {Device} from "../../components/userSessionContext/domain/entities/index.js";

export interface GetAllDevicesUseCase {
    execute(viewer: Viewer): Promise<(Device | Error | null)[]>;
}