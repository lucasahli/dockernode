import {GetLoginByUserUseCase} from "../../../../portsAndInterfaces/ports/GetLoginByUserUseCase.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {AccountService} from "../services/index.js";
import {Login} from "../../domain/entities/index.js";

export class GetLoginByUserUseCaseHandler implements GetLoginByUserUseCase {
    constructor(private accountService: AccountService) {
    }
    async execute(viewer: Viewer, userId: string): Promise<Login> {
        const login = await this.accountService.getLoginByUser(viewer, userId);
        return login ?? Promise.reject("User is not associated with a login!");
    }

}