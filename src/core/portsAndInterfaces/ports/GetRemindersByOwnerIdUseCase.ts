import {Viewer} from "../../sharedKernel/index.js";
import {Reminder} from "../../components/reminderContext/domain/entities/index.js";

export interface GetRemindersByOwnerIdUseCase {
    execute(viewer: Viewer, ownerId: string): Promise<(Reminder | Error | null)[]>;
}