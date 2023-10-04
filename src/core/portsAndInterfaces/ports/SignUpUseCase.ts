import {Viewer} from "../../sharedKernel/index.js";
import {Token} from "../../components/reminderContext/domain/valueObjects/Token.js";

export type SignUpResult = SignUpSuccess | SignUpProblem;

export type SignUpSuccess = {
    token: Token;
};

export class SignUpProblem {
    constructor(public title: string, public invalidInputs: SignUpInvalidInput[]) {}
};

export type SignUpInvalidInput = {
    field: SignUpInvalidInputField;
    message: string;
};

export enum SignUpInvalidInputField {
    EMAIL = "EMAIL",
    PASSWORD = "PASSWORD",
    FULL_NAME = "FULL_NAME",
}


export interface SignUpUseCase {
    execute(viewer: Viewer, email: string, password: string, fullName: string): Promise<SignUpResult>;
}