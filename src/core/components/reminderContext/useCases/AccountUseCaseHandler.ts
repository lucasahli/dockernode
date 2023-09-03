import {AccountUseCase} from "../../../portsAndInterfaces/ports/AccountUseCase.js";
import {Viewer} from "../../../sharedKernel/Viewer.js";
import {AccountService} from "../domain/services/AccountService.js";
import {Login} from "../domain/entities/index.js";
import {rejects} from "assert";

export class AccountUseCaseHandler implements AccountUseCase{

    constructor(private accountService: AccountService) {
    }

    signUp(viewer: Viewer, email: string, password: string): Promise<string | null> {
        return this.accountService.signUp(viewer, email, password);
    }

    signIn(viewer: Viewer, email: string, password: string): Promise<string | null> {
        return this.accountService.signIn(viewer, email, password);
    }

    deleteLogin(viewer: Viewer, id: string): Promise<boolean> {
        // Todo: Implement deleteLogin function
        return Promise.resolve(false);
    }

    async getLoginByUser(viewer: Viewer, userId: string): Promise<Login> {
        const login = await this.accountService.getLoginByUser(viewer, userId);
        return login ?? Promise.reject("User is not associated with a Login!");
    }

}