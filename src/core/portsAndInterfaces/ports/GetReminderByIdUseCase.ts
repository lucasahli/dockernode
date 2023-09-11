import {Viewer} from "../../sharedKernel/index.js";
import {Reminder} from "../../components/reminderContext/domain/entities/index.js";

export interface GetReminderByIdUseCase {
    execute(viewer: Viewer, id: string): Promise<Reminder | null>;
}