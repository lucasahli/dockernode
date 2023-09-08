import {Viewer} from "../../sharedKernel/index.js";

export interface DeleteReminderByIdUseCase {
    execute(viewer: Viewer, id: string): Promise<boolean>;

}