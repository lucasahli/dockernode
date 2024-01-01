import {RefreshAccessResult, RefreshAccessUseCase} from "../../../../portsAndInterfaces/ports/RefreshAccessUseCase.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {AccountService} from "../services/index.js";


export class RefreshAccessUseCaseHandler implements RefreshAccessUseCase {
    constructor(private accountService: AccountService) {}

    async execute(viewer: Viewer, refreshToken: string): Promise<RefreshAccessResult> {
        return this.accountService.refreshAccess(viewer, refreshToken);
    }
}