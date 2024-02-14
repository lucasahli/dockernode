import {Viewer} from "../../../../sharedKernel/index.js";
import {GetUsersByIdsUseCase} from "../../../../portsAndInterfaces/ports/GetUsersByIdsUseCase.js";
import {SessionActivityService, SessionService, UserService} from "../services/index.js";
import {User} from "../../domain/entities/index.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";

export class GetUsersByIdsUseCaseHandler extends SessionUpdater implements GetUsersByIdsUseCase {
    constructor(private userService: UserService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, userIds: string[]): Promise<(User | Error | null)[]> {
        this.updateUserSession(viewer, "Get users by ids");
        return this.userService.getMany(viewer, userIds);
    }
}