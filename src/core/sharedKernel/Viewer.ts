import {IncomingHttpHeaders} from "http";
import {User} from "../components/reminderContext/domain/entities/User.js";
import {UserRole} from "./UserRole.js";
import {Token} from "../components/reminderContext/domain/valueObjects/Token.js";

import jwt from "jsonwebtoken";

export class Viewer {
    private isRootViewer: boolean = false;
    user: User | null;
    jwtSecret: string;
    headers: IncomingHttpHeaders | undefined;
    cookies: any;

    loginId: string | undefined;
    loginEmail: string | undefined;
    userId: string | undefined;
    userRole: UserRole | undefined;

    constructor(headers?: IncomingHttpHeaders, secret?: string, isRootViewer?: boolean) {
        this.headers = headers ?? undefined;
        this.jwtSecret = secret ?? "SomeWrongSecret";
        this.user = null;
        this.isRootViewer = isRootViewer ?? false;
    }

    static Root(): Viewer {
        return new Viewer(undefined, undefined, true);
    }

    public isRootUser(): boolean {
        return this.isRootViewer;
    }

    public getPayloadFromToken(): any | null {
        if (!this.headers){
            return null;
        }
        const bearerToken = this.headers.authorization;
        if (bearerToken !== undefined) {
            const isBearer = this.isBearerToken(bearerToken);
            if (isBearer) {
                if (this.isValidJWT(bearerToken?.replace('Bearer ', ''), this.jwtSecret)){
                    console.log('Is valid JWT');
                    return jwt.verify(bearerToken?.replace('Bearer ', ''), this.jwtSecret);
                }
                console.log("is BAERER but NOT VALID token: ", bearerToken);
            }
            console.log("is DEFINED but not Bearer token: ", bearerToken);
        }
        return null;
    }

    public hasValidToken(): boolean {
        if(this.isRootViewer){
            return true;
        }
        const decodedPayload = this.getPayloadFromToken();
        if (typeof decodedPayload === 'object' && decodedPayload !== null) {
            return decodedPayload.loginId !== null;
        }
        return false;
    }

    async prepareViewer() {
        if(this.isRootViewer){
            return;
        }
        const payloadFromToken = this.getPayloadFromToken();
        if (payloadFromToken) {
            console.log("PAYLOAD: ", payloadFromToken);
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

    isBearerToken(token: string): boolean {
        // Check if the string starts with "Bearer "
        return token.startsWith('Bearer ');
    }

    isValidJWTFormat(jwtString: string): boolean {
        // Check if the string is not empty or null
        if (!jwtString) {
            return false;
        }

        // Split the JWT string into its three parts
        const parts = jwtString.split('.');

        // Check if there are exactly three parts
        if (parts.length !== 3) {
            return false;
        }

        // Check if each part is non-empty
        if (parts.some(part => !part)) {
            return false;
        }

        // Check if each part is a valid Base64Url string
        const base64UrlRegex = /^[A-Za-z0-9-_]+$/;
        return parts.every(part => base64UrlRegex.test(part));
    }

    isJWT(jwtString: string): boolean {
        try {
            return this.isValidJWTFormat(jwtString);
        } catch (error) {
            return false;
        }
    }

    isValidJWT(jwtString: string, secretOrPublicKey?: string | Buffer): boolean {
        try {
            if (this.isJWT(jwtString)) {
                // Step 3: (Optional) Verify Signature if secretOrPublicKey is provided
                if (secretOrPublicKey) {
                    jwt.verify(jwtString, secretOrPublicKey);
                }
            }
            else {
                return false;
            }

            // If all steps pass without throwing an error, it's a valid JWT
            return true;
        } catch (error) {
            return false;
        }
    }

}