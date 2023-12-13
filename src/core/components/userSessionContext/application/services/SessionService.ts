import {Viewer} from "../../../../sharedKernel/index.js";
import {SessionRepository} from "../../../../portsAndInterfaces/interfaces/index.js";
import {Session} from "../../domain/entities/index.js";
import {SessionStatus} from "../../domain/valueObjects/index.js";


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
        endTime?: Date,
        associatedDeviceId?: string | undefined,
        associatedLoginId?: string | undefined,
        associatedRefreshTokenId?: string | undefined
    ): Promise<Session> {
        const canCreate = this.checkCanCreate(viewer);
        const session = await this.sessionRepository.createSession(startTime, sessionStatus, endTime, associatedDeviceId, associatedLoginId, associatedRefreshTokenId);
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
        return viewer.isLoggedIn() && session.associatedLoginId === viewer.loginId;
    }

    async updateSession(viewer: Viewer, session: Session): Promise<boolean> {
        const canUpdate = this.checkCanUpdate(viewer, session);
        return canUpdate ? this.sessionRepository.updateSession(session) : false;
    }
}