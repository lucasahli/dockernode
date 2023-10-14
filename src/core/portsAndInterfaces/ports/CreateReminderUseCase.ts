import {Viewer} from "../../sharedKernel/index.js";
import {Reminder} from "../../components/reminderContext/domain/entities/index.js";

export type CreateReminderResult = CreateReminderSuccess | CreateReminderProblem;

export type CreateReminderSuccess = {
    createdReminder: Reminder;
}

export class CreateReminderProblem {
    constructor(public title: string, public invalidInputs: CreateReminderInvalidInput[]) {}
}

export enum CreateReminderInvalidInputField {
    TITLE = "TITLE",
    DATETIME = "DATETIME",
}

export type CreateReminderInvalidInput = {
    field: CreateReminderInvalidInputField;
    message: string;
}

export interface CreateReminderUseCase {
    execute(viewer: Viewer, title: string, dateTimeToRemind: Date): Promise<CreateReminderResult>;
}