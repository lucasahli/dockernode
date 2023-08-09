import {Hasher} from "../../core/portsAndInterfaces/interfaces/Hasher.js";

const argon2 = require('argon2');

export class ArgonHasher extends Hasher{
    compare(plainText: string, hash: string): Promise<boolean> {
        return argon2.verify(hash, plainText);
    }

    hash(plainText: string): Promise<string> {
        return argon2.hash(plainText);
    }

}