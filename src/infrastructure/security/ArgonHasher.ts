import {Hasher} from "../../core/portsAndInterfaces/interfaces/Hasher.js";

import argon2 from 'argon2';

export class ArgonHasher implements Hasher{
    compare(plainText: string, hash: string): Promise<boolean> {
        return argon2.verify(hash, plainText);
    }

    hash(plainText: string): Promise<string> {
        return argon2.hash(plainText);
    }

}