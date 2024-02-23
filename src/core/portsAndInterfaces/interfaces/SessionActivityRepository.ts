import {SessionActivity} from "../../components/userSessionContext/domain/entities/SessionActivity.js";


export interface SessionActivityRepository {

    //CRUD
    createSessionActivity(
        description: string,
        associatedSessionId: string
    ): Promise<SessionActivity>
    getSessionActivityById(id: string): Promise<SessionActivity | null>
    deleteSessionActivity(id: string): Promise<boolean>

    getAllSessionActivityIds(): Promise<string[] | null>
    getManySessionActivitiesByIds(ids: string[]): Promise<(SessionActivity | Error | null)[]>
    getSessionActivityIdsBySessionId(sessionId: string): Promise<string[]>

}