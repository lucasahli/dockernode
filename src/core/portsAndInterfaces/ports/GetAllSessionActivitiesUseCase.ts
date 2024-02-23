import {Viewer} from "../../sharedKernel/index.js";
import {SessionActivity} from "../../components/userSessionContext/domain/entities/index.js";



export interface GetAllSessionActivitiesUseCase {
    execute(viewer: Viewer): Promise<(SessionActivity | Error | null)[]>;
}