import {SignInUseCase} from "../../../../portsAndInterfaces/ports/index.js";
import {AccountService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Token} from "../../domain/valueObjects/Token.js";

export class SignInUseCaseHandler implements SignInUseCase {
    constructor(private accountService: AccountService) {
    }

    execute(viewer: Viewer, email: string, password: string): Promise<Token | Error> {
        return this.accountService.signIn(viewer, email, password);
    }
}