import {Viewer} from "../../sharedKernel/index.js";
import {Reminder} from "../../components/reminderContext/domain/entities/index.js";

export interface GetRemindersByOwnerUseCase {
    execute(viewer: Viewer, id: string): Promise<(Reminder | Error | null)[]>;
}