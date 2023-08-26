import {jest} from "@jest/globals";
import {PasswordManager} from "./index.js";
import {BcryptHasher} from "../../../../../infrastructure/security/BcryptHasher.js";


describe("PasswordManager", () => {
    const passwordManager = new PasswordManager(new BcryptHasher());
    const password = "superSecretPassword01"
    const passwordHashed = "$2b$08$OBj8Oq3MB2K7VhAlpgVtBeesgLM6/a7WL5.tfFj3vFgSxRoSOYxxy"

    test("Can instanciate", () => {
        expect(passwordManager).toBeInstanceOf(PasswordManager);
    })

    describe(".hashPassword", () => {
        test("Returns hashed password", async () => {
            expect(await passwordManager.hashPassword(password)).toHaveLength(passwordHashed.length);
        })
    })

    describe(".checkIsCorrect", () => {
        test("Returns true if password is correct", async () => {
            expect(await passwordManager.checkIsCorrect(password, passwordHashed)).toBeTruthy();
        })

        test("Returns false if password is wrong", async () => {
            expect(await passwordManager.checkIsCorrect("wrongPassword", passwordHashed)).toBeFalsy();
        })
    })
})