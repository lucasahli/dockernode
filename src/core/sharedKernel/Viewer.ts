import {IncomingHttpHeaders} from "http";
import {User} from "../components/reminderContext/domain/entities/User.js";
import {UserRole} from "./UserRole.js";

import jwt from "jsonwebtoken";

export class Viewer {
    user: User | null;
    jwtSecret: string;
    headers: IncomingHttpHeaders;
    cookies: any;

    loginId: string;
    loginEmail: string;
    userId: string;
    userRole: UserRole;

    constructor(headers: IncomingHttpHeaders, secret: string = 'SomeWrongSecret') {
        this.headers = headers;
        this.jwtSecret = secret;
        this.user = null;
        // const token = this.headers.authorization;
        // const user = this.getUserFromToken(token.replace('Bearer ', ''), secret);
    }

    public getPayloadFromToken(): any | null {
        const bearerToken = this.headers.authorization;
        if (bearerToken !== undefined) {
            return jwt.verify(bearerToken?.replace('Bearer ', ''), this.jwtSecret);
        }
        return null;
    }

    public hasValidToken(): boolean {
        const decodedPayload = this.getPayloadFromToken();
        if (typeof decodedPayload === 'object' && decodedPayload !== null) {
            return decodedPayload.loginId != null;
        }
        return false;
    }

    async prepareViewer() {
        const payloadFromToken = this.getPayloadFromToken();
        if (payloadFromToken) {
            this.loginId = payloadFromToken.loginId;
            this.loginEmail = payloadFromToken.loginEmail;
            this.userId = payloadFromToken.userId;
            this.userRole = payloadFromToken.userRole;
        }

    }

    public isLoggedIn(): boolean {
        return this.hasValidToken();
        // return this.user !== null;
    }

}