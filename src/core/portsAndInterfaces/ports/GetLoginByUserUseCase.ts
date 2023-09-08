import {Viewer} from "../../sharedKernel/index.js";
import {Login} from "../../components/reminderContext/domain/entities/index.js";

export interface GetLoginByUserUseCase {
    execute(viewer: Viewer, userId: string): Promise<Login>;
}