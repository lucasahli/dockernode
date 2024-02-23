import {Viewer} from "../../sharedKernel/index.js";
import {Session} from "../../components/userSessionContext/domain/entities/index.js";


export interface GetSessionByIdUseCase {
    execute(viewer: Viewer, id: string): Promise<Session | null>;
}