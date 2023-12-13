import {Viewer} from "../../sharedKernel/index.js";
import {Session} from "../../components/userSessionContext/domain/entities/index.js";

export interface CreateSessionUseCase {
    execute(viewer: Viewer): Promise<Session | Error | null>;
}

