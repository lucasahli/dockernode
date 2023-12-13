import {RefreshToken} from "../../components/userSessionContext/domain/entities/index.js";

export interface RefreshTokenRepository {

    //CRUD
    createRefreshToken(
        token: string,
        expiration: Date,
        revoked: boolean,
        associatedLoginId: string,
        associatedDeviceId: string): Promise<RefreshToken>
    getRefreshTokenById(id: string): Promise<RefreshToken | null>
    updateRefreshToken(updatedRefreshToken: RefreshToken): Promise<boolean>
    deleteRefreshToken(id: string): Promise<boolean>

    getAllRefreshTokenIds(): Promise<string[] | null>
    getManyRefreshTokensByIds(ids: string[]): Promise<(RefreshToken | Error | null)[]>

}