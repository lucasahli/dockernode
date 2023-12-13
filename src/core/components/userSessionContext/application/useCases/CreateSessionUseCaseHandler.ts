import {CreateSessionUseCase} from "../../../../portsAndInterfaces/ports/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {Session} from "../../domain/entities/index.js";
import {SessionService} from "../services/index.js";
import {SessionStatus} from "../../domain/valueObjects/index.js";

export class CreateSessionUseCaseHandler implements CreateSessionUseCase {
    constructor(private sessionService: SessionService) {
    }

    execute(viewer: Viewer): Promise<Session> {
        const dateTimeNow = new Date(Date.now());
        return this.sessionService.createSession(
            viewer,
            dateTimeNow,
            SessionStatus.active,
            undefined,
            undefined,
            undefined,
            undefined
        );
    }
}