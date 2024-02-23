import {GetLoginByUserUseCase} from "../../../../portsAndInterfaces/ports/GetLoginByUserUseCase.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {AccountService, SessionActivityService, SessionService} from "../services/index.js";
import {Login} from "../../domain/entities/index.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";

export class GetLoginByUserUseCaseHandler extends SessionUpdater implements GetLoginByUserUseCase {
    constructor(private accountService: AccountService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    async execute(viewer: Viewer, userId: string): Promise<Login> {
        this.updateUserSession(viewer, "Get login by user");
        const login = await this.accountService.getLoginByUser(viewer, userId);
        return login ?? Promise.reject("User is not associated with a login!");
    }

}