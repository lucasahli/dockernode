import {SignInUseCase} from "../../../../portsAndInterfaces/ports/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {SignInProblem, SignInResult} from "../../../../portsAndInterfaces/ports/SignInUseCase.js";
import {AccountService} from "../services/index.js";

export class SignInUseCaseHandler implements SignInUseCase {
    constructor(private accountService: AccountService) {
    }

    async execute(viewer: Viewer, email: string, password: string): Promise<SignInResult> {
        const signInResult = await this.accountService.signIn(viewer, email, password);
        if (!(signInResult instanceof SignInProblem)) {
            signInResult.sessionId
        }
        return signInResult
    }
}