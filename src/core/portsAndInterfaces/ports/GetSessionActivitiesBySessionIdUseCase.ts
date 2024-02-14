import {Viewer} from "../../sharedKernel/index.js";
import {SessionActivity} from "../../components/userSessionContext/domain/entities/index.js";


export interface GetSessionActivitiesBySessionIdUseCase {
    execute(viewer: Viewer, sessionId: string): Promise<(SessionActivity | Error | null)[]>;
}