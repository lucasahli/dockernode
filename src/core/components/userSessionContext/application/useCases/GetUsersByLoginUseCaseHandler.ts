import {GetUsersByLoginUseCase} from "../../../../portsAndInterfaces/ports/GetUsersByLoginUseCase.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {AccountService} from "../services/index.js";
import {User} from "../../domain/entities/index.js";

export class GetUsersByLoginUseCaseHandler implements GetUsersByLoginUseCase {
    constructor(private accountService: AccountService) {
    }

    async execute(viewer: Viewer, loginId: string): Promise<(User | Error | null)[] | null> {
        const user = await this.accountService.getUsersByLogin(viewer, loginId);
        return user ?? Promise.reject("Login not associated with that user");
    }

}