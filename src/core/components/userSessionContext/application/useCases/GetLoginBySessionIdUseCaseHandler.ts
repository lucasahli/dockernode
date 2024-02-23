import {SessionUpdater} from "../../../../sharedKernel/SessionUpdater.js";
import {DeviceService, LoginService, SessionActivityService, SessionService} from "../services/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Device, Login} from "../../domain/entities/index.js";
import {GetLoginBySessionIdUseCase} from "../../../../portsAndInterfaces/ports/GetLoginBySessionIdUseCase.js";



export class GetLoginBySessionIdUseCaseHandler extends SessionUpdater implements GetLoginBySessionIdUseCase {
    constructor(private loginService: LoginService, sessionService: SessionService, sessionActivityService: SessionActivityService) {
        super(sessionService, sessionActivityService);
    }

    execute(viewer: Viewer, sessionId: string): Promise<Login | null> {
        this.updateUserSession(viewer, "Get login by sessionId");
        return this.loginService.getLoginBySessionId(viewer, sessionId);
    }
}