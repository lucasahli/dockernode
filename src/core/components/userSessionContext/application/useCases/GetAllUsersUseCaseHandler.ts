import {GetAllUsersUseCase} from "../../../../portsAndInterfaces/ports/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {SessionActivityService, SessionService, UserService} from "../services/index.js";
import {User} from "../../domain/entities/index.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";

export class GetAllUsersUseCaseHandler extends SessionUpdater implements GetAllUsersUseCase {
    constructor(private userService: UserService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer): Promise<(User | Error | null)[]> {
        this.updateUserSession(viewer, "Get all users");
        return this.userService.getAllUsers(viewer);
    }
}