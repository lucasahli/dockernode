import {Viewer} from "../../sharedKernel/index.js";
import {AccessToken} from "../../components/reminderContext/domain/valueObjects/index.js";
import {RefreshToken} from "../../components/userSessionContext/domain/entities/index.js";

export type SignUpResult = SignUpSuccess | SignUpProblem;

export type SignUpSuccess = {
    sessionId: string,
    accessToken: AccessToken,
    refreshToken: RefreshToken;
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