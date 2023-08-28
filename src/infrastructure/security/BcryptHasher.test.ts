import {jest} from "@jest/globals";
import {BcryptHasher} from "./BcryptHasher.js";

describe("BcryptHasher", () => {
    const bcryptHasher = new BcryptHasher();
    const password = "superSecretPassword01"
    const passwordHashed = "$2b$08$OBj8Oq3MB2K7VhAlpgVtBeesgLM6/a7WL5.tfFj3vFgSxRoSOYxxy"

    test("Can be instanciated", () => {
        expect(bcryptHasher).toBeInstanceOf(BcryptHasher);
    })

    describe(".hash", () => {
        test("Returns the hashed version of the passed plain text", async () => {
            expect(await bcryptHasher.hash(password)).toHaveLength(passwordHashed.length);
        })
    })

    describe(".compare", () => {
        test("Returns true if password is correct", async () => {
            expect(await bcryptHasher.compare(password, passwordHashed)).toBeTruthy();
        })

        test("Returns false if password is wrong", async () => {
            expect(await bcryptHasher.compare("wrongPassword", passwordHashed)).toBeFalsy();
        })
    })

})