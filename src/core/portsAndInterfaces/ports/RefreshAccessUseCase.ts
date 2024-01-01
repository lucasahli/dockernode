import {Viewer} from "../../sharedKernel/index.js";
import {RefreshToken} from "../../components/userSessionContext/domain/entities/index.js";
import {AccessToken} from "../../components/userSessionContext/domain/valueObjects/index.js";

export abstract class RefreshAccessResult {}

export class RefreshAccessSuccess extends RefreshAccessResult {
    constructor(public accessToken: AccessToken, public refreshToken: RefreshToken, public sessionId: string) {
        super();
    }
}

export class RefreshAccessProblem extends RefreshAccessResult {
    constructor() {
        super();
    }
}

export interface RefreshAccessUseCase {
    execute(viewer: Viewer, refreshToken: string): Promise<RefreshAccessResult>
}