import {Viewer} from "../../../../sharedKernel/index.js";
import {RefreshTokenRepository} from "../../../../portsAndInterfaces/interfaces/index.js";
import {RefreshToken} from "../../domain/entities/index.js";


export class RefreshTokenService {
    private refreshTokenRepository: RefreshTokenRepository;

    constructor(repo: RefreshTokenRepository) {
        this.refreshTokenRepository = repo;
    }

    // Single source of truth for fetching
    async generate(viewer: Viewer, id: string): Promise<RefreshToken | null> {
        const refreshToken = await this.refreshTokenRepository.getRefreshTokenById(id); // Nullable
        if (refreshToken === null) return null;
        const canSee = this.checkCanSee(viewer, refreshToken);
        return canSee ? refreshToken : null;
    }

    checkCanSee(viewer: Viewer, refreshToken: RefreshToken): boolean {
        return true;
    }

    async createRefreshToken(
        viewer: Viewer,
        tokenString: string,
        expiration: Date,
        revoked: boolean,
        associatedLoginId: string,
        associatedDeviceId: string
    ): Promise<RefreshToken> {
        const canCreate = this.checkCanCreate(viewer);

        const refreshToken = await this.refreshTokenRepository.createRefreshToken(
            tokenString,
            expiration,
            revoked,
            associatedLoginId,
            associatedDeviceId
        );
        return refreshToken;
    }

    checkCanCreate(viewer: Viewer): boolean {
        return true;
    }

    async getAllRefreshTokens(viewer: Viewer): Promise<(RefreshToken | Error | null)[]> {
        const ids = await this.refreshTokenRepository.getAllRefreshTokenIds();
        if(ids !== null){
            return this.getMany(viewer, ids);
        }
        return [];
    }

    async getMany(viewer: Viewer, ids: string[]): Promise<(RefreshToken | Error | null)[]> {
        return Promise.all(ids.map((id) => this.generate(viewer, id)));
    }

    checkCanUpdate(viewer: Viewer, refreshToken: RefreshToken): boolean {
        if(viewer.isRootUser()){
            return true;
        }
        return true;
    }

    async updateRefreshToken(viewer: Viewer, refreshToken: RefreshToken): Promise<boolean> {
        const canUpdate = this.checkCanUpdate(viewer, refreshToken);
        return canUpdate ? this.refreshTokenRepository.updateRefreshToken(refreshToken) : false;
    }
}