import {Session} from "../../components/userSessionContext/domain/entities/index.js";
import {SessionStatus} from "../../components/userSessionContext/domain/valueObjects/index.js";


export interface SessionRepository {

    //CRUD
    createSession(
        startTime: Date,
        sessionStatus: SessionStatus,
        associatedSessionActivities: string[],
        endTime?: Date,
        associatedDeviceId?: string,
        associatedLoginId?: string,
        associatedRefreshTokenId?: string,
        ): Promise<Session>
    getSessionById(id: string): Promise<Session | null>
    updateSession(updatedSession: Session): Promise<boolean>
    deleteSession(id: string): Promise<boolean>

    getAllSessionIds(): Promise<string[] | null>
    getManySessionsByIds(ids: string[]): Promise<(Session | Error | null)[]>
    getSessionIdsByDeviceId(deviceId: string): Promise<string[]>
    getSessionIdBySessionActivityId(sessionActivityId: string): Promise<string | null>
}