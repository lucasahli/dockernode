import {Viewer} from "../../../../sharedKernel/index.js";
import {SessionRepository} from "../../../../portsAndInterfaces/interfaces/index.js";
import {Session} from "../../domain/entities/index.js";
import {SessionStatus} from "../../domain/valueObjects/index.js";
import sessionActivity from "../../../../../presentation/graphQL/resolvers/sessionActivity.js";


export class SessionService {
    private sessionRepository: SessionRepository;

    constructor(repo: SessionRepository) {
        this.sessionRepository = repo;
    }

    // Single source of truth for fetching
    async generate(viewer: Viewer, id: string): Promise<Session | null> {
        const session = await this.sessionRepository.getSessionById(id); // Nullable
        if (session === null) return null;
        const canSee = this.checkCanSee(viewer, session);
        return canSee ? session : null;
    }

    checkCanSee(viewer: Viewer, session: Session): boolean {
        return true;
    }

    async createSession(
        viewer: Viewer,
        startTime: Date,
        sessionStatus: SessionStatus,
        associatedSessionActivityIds: string[],
        endTime?: Date,
        associatedDeviceId?: string | undefined,
        associatedLoginId?: string | undefined,
        associatedRefreshTokenId?: string | undefined
    ): Promise<Session> {
        const canCreate = this.checkCanCreate(viewer);
        const session = await this.sessionRepository.createSession(startTime, sessionStatus, associatedSessionActivityIds, endTime, associatedDeviceId, associatedLoginId, associatedRefreshTokenId);
        console.log(`Session (id: ${session.id}) created...`);
        return session;
    }

    checkCanCreate(viewer: Viewer): boolean {
        return true;
    }

    async getAllSessions(viewer: Viewer): Promise<(Session | Error | null)[]> {
        const ids = await this.sessionRepository.getAllSessionIds();
        if(ids !== null){
            return this.getMany(viewer, ids);
        }
        return [];
    }

    async getMany(viewer: Viewer, ids: string[]): Promise<(Session | Error | null)[]> {
        return Promise.all(ids.map((id) => this.generate(viewer, id)));
    }

    checkCanUpdate(viewer: Viewer, session: Session): boolean {
        if(viewer.isRootUser()){
            return true;
        }
        return (viewer.getSessionId() == session.id) || (viewer.isLoggedIn() && session.associatedLoginId === viewer.loginId);
    }

    async updateSession(viewer: Viewer, session: Session): Promise<boolean> {
        const canUpdate = this.checkCanUpdate(viewer, session);
        return canUpdate ? this.sessionRepository.updateSession(session) : false;
    }

    async getOrCreateSession(viewer: Viewer, deviceId: string, loginId: string, refreshTokenId: string): Promise<Session> {
        const sessionId = viewer.getSessionId();
        if(sessionId){
            const session = await this.generate(viewer, sessionId);
            if(session){
                if(!session.isExpired()){
                    return session;
                }
            }
        }
        const newSession = await this.createSession(
            viewer,
            new Date(Date.now()),
            SessionStatus.active,
            [],
            undefined,
            deviceId,
            loginId,
            refreshTokenId
        );
        return newSession;
    }

    async updateSessionActivity(viewer: Viewer, sessionActivityId: string): Promise<boolean> {
        const sessionId = viewer.getSessionId();
        if(sessionId){
            const session = await this.generate(viewer, sessionId);
            if(session){
                if(!session.isExpired()){
                    session.addSessionActivity(sessionActivityId);
                    return await this.updateSession(viewer, session);
                }
                console.log("Session is expired!!!");
            }
            else {
                console.log(`Could not generate Session (id: ${sessionId})`);
            }
        }
        return false;
    }

    async getSessionsByDeviceId(viewer: Viewer, deviceId: string): Promise<(Session | Error | null)[]> {
        const ids = await this.sessionRepository.getSessionIdsByDeviceId(deviceId);
        if(ids !== null){
            return this.getMany(viewer, ids);
        }
        return [];
    }

    async getSessionBySessionActivityId(viewer: Viewer, sessionActivityId: string): Promise<Session | null> {
        const sessionId = await this.sessionRepository.getSessionIdBySessionActivityId(sessionActivityId);
        if(sessionId !== null){
            return this.generate(viewer, sessionId);
        }
        return null;
    }

}