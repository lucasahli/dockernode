import {AccountUseCase} from "../../../portsAndInterfaces/ports/AccountUseCase.js";
import {Viewer} from "../../../sharedKernel/Viewer.js";
import {AccountService} from "../domain/services/AccountService.js";

export class AccountUseCaseHandler implements AccountUseCase{

    constructor(private accountService: AccountService) {
    }
    deleteLogin(viewer: Viewer, id: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    signIn(viewer: Viewer, email: string, password: string): Promise<string | null> {
        return this.accountService.signIn(viewer, email, password);
    }

    signUp(viewer: Viewer, email: string, password: string): Promise<string | null> {
        return this.accountService.signUp(viewer, email, password);
    }

}