import {CustomError, ErrorCode} from "./index.js";

export class DatabaseError extends CustomError {
    constructor(message: string) {
        super(message, ErrorCode.DATABASE_ERROR);
        this.name = "DatabaseError";
    }
}