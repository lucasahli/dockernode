import {
    RefreshAccessResult,
    RefreshAccessSuccess,
    RefreshAccessUseCase
} from "../../../../portsAndInterfaces/ports/RefreshAccessUseCase.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {AccountService, SessionActivityService, SessionService} from "../services/index.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";


export class RefreshAccessUseCaseHandler extends SessionUpdater implements RefreshAccessUseCase {
    constructor(private accountService: AccountService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    async execute(viewer: Viewer, refreshToken: string): Promise<RefreshAccessResult> {
        const result = await this.accountService.refreshAccess(viewer, refreshToken);
        this.updateUserSession(viewer, "Refresh access", (result as RefreshAccessSuccess)?.sessionId);
        return result;
    }
}