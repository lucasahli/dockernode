import {CustomError, ErrorCode} from "./index.js";

export class ValidationError extends CustomError {
    constructor(message: string) {
        super(message, ErrorCode.VALIDATION_ERROR);
        this.name = "ValidationError";
    }
}