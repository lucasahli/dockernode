import {ErrorCode} from "./ErrorCode.js";

export class CustomError implements Error {
    name: string = "CustomError";
    message: string;
    code: ErrorCode;

    constructor(message: string, code: ErrorCode) {
        this.message = message;
        this.code = code;
    }
}
