import {CustomError, ErrorCode} from "./index.js";

export class AuthenticationError extends CustomError {
    constructor() {
        super("Authentication required. Please log in.", ErrorCode.AUTHENTICATION_ERROR);
        this.name = "AuthenticationError";
    }
}