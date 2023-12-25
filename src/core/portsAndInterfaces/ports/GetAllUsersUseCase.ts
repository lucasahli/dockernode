import {Viewer} from "../../sharedKernel/index.js";
import {User} from "../../components/userSessionContext/domain/entities/index.js";

export interface GetAllUsersUseCase {
    execute(viewer: Viewer): Promise<(User | Error | null)[]>;
}