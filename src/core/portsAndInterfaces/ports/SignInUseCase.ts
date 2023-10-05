import {ValidationError, Viewer} from "../../sharedKernel/index.js";
import {Token} from "../../components/reminderContext/domain/valueObjects/Token.js";

export type SignInResult = SignInSuccess | SignInProblem;

export type SignInSuccess = {
    token: Token;
};

export class SignInProblem {
    constructor(public title: string, public invalidInputs: SignInInvalidInput[]) {}
};

export type SignInInvalidInput = {
    field: SignInInvalidInputField;
    message: string;
};

export enum SignInInvalidInputField {
    EMAIL = "EMAIL",
    PASSWORD = "PASSWORD",
}

export interface SignInUseCase {
    execute(viewer: Viewer, email: string, password: string): Promise<SignInResult>;
}