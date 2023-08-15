import {Hasher} from "../../core/portsAndInterfaces/interfaces/Hasher.js";
import bcrypt from 'bcrypt';


export class BcryptHasher implements Hasher {
    saltRounds: number = 8;

    hash(plainText: string): Promise<string> {
        return bcrypt.hash(plainText, this.saltRounds)
            .then((hash: string) => {return hash;});
    }

    compare(plainText: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plainText, hash)
            .then((isEqual: boolean) => {return isEqual;});
    }
}
