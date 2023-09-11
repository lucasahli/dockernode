import {SignUpUseCase} from "../../../../portsAndInterfaces/ports/SignUpUseCase.js";
import {AccountService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Token} from "../../domain/valueObjects/Token.js";

export class SignUpUseCaseHandler implements SignUpUseCase {
    constructor(private accountService: AccountService) {
    }

    execute(viewer: Viewer, email: string, password: string): Promise<Token | null> {
        return this.accountService.signUp(viewer, email, password);
    }
}