import {SignUpUseCase} from "../../../../portsAndInterfaces/ports/SignUpUseCase.js";
import {AccountService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";

export class SignUpUseCaseHandler implements SignUpUseCase {
    constructor(private accountService: AccountService) {
    }

    execute(viewer: Viewer, email: string, password: string): Promise<string | null> {
        return this.accountService.signUp(viewer, email, password);
    }
}