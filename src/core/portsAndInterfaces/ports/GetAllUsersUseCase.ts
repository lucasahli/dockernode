import {Viewer} from "../../sharedKernel/index.js";
import {User} from "../../components/reminderContext/domain/entities/index.js";

export interface GetAllUsersUseCase {
    execute(viewer: Viewer): Promise<(User | Error | null)[]>;
}