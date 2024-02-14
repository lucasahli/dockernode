import {Viewer} from "../../sharedKernel/index.js";
import {Session} from "../../components/userSessionContext/domain/entities/index.js";


export interface GetSessionBySessionActivityIdUseCase {
    execute(viewer: Viewer, sessionActivityId: string): Promise<Session | null>;
}

