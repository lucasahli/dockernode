import {Viewer} from "../../sharedKernel/index.js";
import {Login} from "../../components/userSessionContext/domain/entities/index.js";



export interface GetLoginBySessionIdUseCase {
    execute(viewer: Viewer, sessionId: string): Promise<Login | null>;
}