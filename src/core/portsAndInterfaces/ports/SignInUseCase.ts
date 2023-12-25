import {ValidationError, Viewer} from "../../sharedKernel/index.js";
import {RefreshToken} from "../../components/userSessionContext/domain/entities/index.js";
import {AccessToken} from "../../components/userSessionContext/domain/valueObjects/index.js";

export type SignInResult = SignInSuccess | SignInProblem

export type SignInSuccess = {
    sessionId: string;
    accessToken: AccessToken;
    refreshToken: RefreshToken;
}

export class SignInProblem {
    constructor(public title: string, public invalidInputs: SignInInvalidInput[]) {}
}

export type SignInInvalidInput = {
    field: SignInInvalidInputField;
    message: string;
}

export enum SignInInvalidInputField {
    EMAIL = "EMAIL",
    PASSWORD = "PASSWORD",
}

export interface SignInUseCase {
    execute(viewer: Viewer, email: string, password: string): Promise<SignInResult>;
}