import {Viewer} from "../../sharedKernel/index.js";
import {Reminder} from "../../components/reminderContext/domain/entities/index.js";

export interface GetAllRemindersUseCase {
    execute(viewer: Viewer): Promise<(Reminder | Error | null)[]>;

}