import {Viewer} from "../../sharedKernel/index.js";
import {Reminder} from "../../components/reminderContext/domain/entities/index.js";

export interface CreateReminderUseCase {
    execute(viewer: Viewer, title: string, dateTimeToRemind: Date): Promise<Reminder | null>;
}