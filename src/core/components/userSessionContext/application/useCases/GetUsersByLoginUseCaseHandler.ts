import {GetUsersByLoginUseCase} from "../../../../portsAndInterfaces/ports/GetUsersByLoginUseCase.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {AccountService, SessionActivityService, SessionService} from "../services/index.js";
import {User} from "../../domain/entities/index.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";

export class GetUsersByLoginUseCaseHandler extends SessionUpdater implements GetUsersByLoginUseCase {
    constructor(private accountService: AccountService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    async execute(viewer: Viewer, loginId: string): Promise<(User | Error | null)[] | null> {
        this.updateUserSession(viewer, "Get users by login");
        const user = await this.accountService.getUsersByLogin(viewer, loginId);
        return user ?? Promise.reject("Login not associated with that user");
    }

}