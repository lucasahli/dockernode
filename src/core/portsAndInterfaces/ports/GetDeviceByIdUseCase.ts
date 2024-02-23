import {Viewer} from "../../sharedKernel/index.js";
import {Device} from "../../components/userSessionContext/domain/entities/index.js";

export interface GetDeviceByIdUseCase {
    execute(viewer: Viewer, id: string): Promise<Device | null>;
}