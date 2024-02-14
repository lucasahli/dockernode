import {Viewer} from "../../../../sharedKernel/index.js";
import {SessionActivity} from "../../domain/entities/index.js";
import {SessionActivityRepository} from "../../../../portsAndInterfaces/interfaces/index.js";

export class SessionActivityService {
    private sessionActivityRepository: SessionActivityRepository;

    constructor(repo: SessionActivityRepository) {
        this.sessionActivityRepository = repo;
    }

    // Single source of truth for fetching
    async generate(viewer: Viewer, id: string): Promise<SessionActivity | null> {
        const sessionActivity = await this.sessionActivityRepository.getSessionActivityById(id); // Nullable
        if (sessionActivity === null) return null;
        const canSee = this.checkCanSee(viewer, sessionActivity);
        return canSee ? sessionActivity : null;
    }

    checkCanSee(viewer: Viewer, sessionActivity: SessionActivity): boolean {
        return true;
    }

    async createSessionActivity(
        viewer: Viewer,
        description: string,
        associatedSessionId: string
    ): Promise<SessionActivity> {
        const canCreate = this.checkCanCreate(viewer);
        if(canCreate){
            return await this.sessionActivityRepository.createSessionActivity(description, associatedSessionId);
        }
        return Promise.reject("Can not create SessionActivity");
    }

    checkCanCreate(viewer: Viewer): boolean {
        return true;
    }

    async getAllSessionActivities(viewer: Viewer): Promise<(SessionActivity | Error | null)[]> {
        const ids = await this.sessionActivityRepository.getAllSessionActivityIds();
        if(ids !== null){
            return this.getMany(viewer, ids);
        }
        return [];
    }

    async getMany(viewer: Viewer, ids: string[]): Promise<(SessionActivity | Error | null)[]> {
        return Promise.all(ids.map((id) => this.generate(viewer, id)));
    }

    async getSessionActivitiesBySessionId(viewer: Viewer, sessionId: string): Promise<(SessionActivity | Error | null)[]> {
        const ids = await this.sessionActivityRepository.getSessionActivityIdsBySessionId(sessionId);
        if(ids !== null){
            return this.getMany(viewer, ids);
        }
        return [];
    }
}