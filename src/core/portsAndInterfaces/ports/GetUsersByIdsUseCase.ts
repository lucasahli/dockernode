import {Viewer} from "../../sharedKernel/index.js";
import {User} from "../../components/reminderContext/domain/entities/index.js";

export interface GetUsersByIdsUseCase {
    execute(viewer: Viewer, userIds: string[]): Promise<(User | Error | null)[]>;
}