import {Viewer} from "../../sharedKernel/index.js";
import {User} from "../../components/userSessionContext/domain/entities/index.js";

export interface GetUsersByIdsUseCase {
    execute(viewer: Viewer, userIds: string[]): Promise<(User | Error | null)[]>;
}