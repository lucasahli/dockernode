import {Viewer} from "../../sharedKernel/index.js";
import {User} from "../../components/reminderContext/domain/entities/index.js";

export interface GetUserByIdUseCase {
    execute(viewer: Viewer, id: string): Promise<User | null>;
}