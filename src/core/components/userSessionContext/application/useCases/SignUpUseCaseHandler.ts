import {SignUpUseCase, SignUpResult} from "../../../../portsAndInterfaces/ports/SignUpUseCase.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {AccountService} from "../services/index.js";

export class SignUpUseCaseHandler implements SignUpUseCase {
    constructor(private accountService: AccountService) {}

    async execute(viewer: Viewer, email: string, password: string, fullName: string): Promise<SignUpResult> {
        return this.accountService.signUp(viewer, email, password, fullName);
    }
}