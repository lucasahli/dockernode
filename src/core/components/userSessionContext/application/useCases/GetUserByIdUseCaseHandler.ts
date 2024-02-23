import {GetUserByIdUseCase} from "../../../../portsAndInterfaces/ports/GetUserByIdUseCase.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {SessionActivityService, SessionService, UserService} from "../services/index.js";
import {User} from "../../domain/entities/index.js";
import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";

export class GetUserByIdUseCaseHandler extends SessionUpdater implements GetUserByIdUseCase {
    constructor(private userService: UserService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, id: string): Promise<User | null> {
        this.updateUserSession(viewer, "Get user by id");
        return this.userService.generate(viewer, id);
    }

}