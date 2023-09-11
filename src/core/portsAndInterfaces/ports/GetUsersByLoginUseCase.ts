import {Viewer} from "../../sharedKernel/index.js";
import {User} from "../../components/reminderContext/domain/entities/index.js";

export interface GetUsersByLoginUseCase {
    execute(viewer: Viewer, loginId: string): Promise<(User | Error | null)[] | null>;
}