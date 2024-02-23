import {Hasher} from "../../../../portsAndInterfaces/interfaces/Hasher.js";

export class PasswordManager {
    hasher: Hasher;

    constructor(aHasher: Hasher) {
        this.hasher = aHasher;
    }

    hashPassword(password: string): Promise<string> {
        return this.hasher.hash(password);
    }

    checkIsCorrect(password: string, hashedPassword: string): Promise<boolean>{
        return this.hasher.compare(password, hashedPassword);
    }
}