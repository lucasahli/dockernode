import {Viewer} from "../../sharedKernel/index.js";
import {User} from "../../components/userSessionContext/domain/entities/index.js";

export interface GetUserByIdUseCase {
    execute(viewer: Viewer, id: string): Promise<User | null>;
}