import {Viewer} from "../../sharedKernel/index.js";
import {SessionActivity} from "../../components/userSessionContext/domain/entities/index.js";



export interface GetSessionActivityByIdUseCase {
    execute(viewer: Viewer, id: string): Promise<SessionActivity | null>;
}