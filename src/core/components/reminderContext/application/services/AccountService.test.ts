import {jest} from "@jest/globals";
import {describe, expect, test} from '@jest/globals';

import {PasswordManager} from "../../domain/services/index.js";
import {AccountService, LoginService, UserService} from "../../application/services/index.js";
import {MockHeaders, UserRole, Viewer} from "../../../../sharedKernel/index.js";
import {Login, User} from "../../domain/entities/index.js";

import {MockupRepository} from "../../../../../infrastructure/persistence/mockup/MockupRepository.js";
import {BcryptHasher} from "../../../../../infrastructure/security/BcryptHasher.js";

import jwt from 'jsonwebtoken';
import {Token} from "../../domain/valueObjects/Token.js";

describe("AccountService", () => {
    const mockRepo = new MockupRepository();
    const accountService = new AccountService(
        new LoginService(mockRepo, new PasswordManager(new BcryptHasher())),
        new UserService(mockRepo), new PasswordManager(new BcryptHasher())
    );

    test("Can be instanciated", async () => {
        expect(accountService).toBeInstanceOf(AccountService);
    })

    describe(".signUp", () => {
        test("creates a new login for an unregistered email and returns a JWT", async () => {
            expect.assertions(1);
            const viewer = new Viewer(new MockHeaders(undefined));
            const result = await accountService.signUp(viewer, "newEmail@test.com", "passwordTest");
            return expect(result.token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+\/=]*)/); // // Match a JWT
        })

        test("can not create a login with an email that exists", async () => {
            expect.assertions(1);
            const viewer = new Viewer(new MockHeaders(undefined));
            const result = await accountService.signUp(viewer, "mockup01@test.com", "passwordTest");
            expect(result).toBeNull();
        })
    })

    describe(".createToken", () => {
        test("creates a new token string when given a login with id and email and a user with a role", () => {
            const login = new Login("1", "mockup01@test.com", "superSecretPassword01", ["1"]);
            const user = new User("1", login.id, UserRole.freemium, "Firstname01", "Lastname01")
            expect((accountService as any).createToken(login, user, process.env.SECRET!, '30m').token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+\/=]*)/) // Match a JWT
        })
    })

    describe(".checkCanSignUp", () => {
        test("Can signUp if a token was created", () => {
            const unknownViewer = new Viewer(new MockHeaders(undefined));
            const token = new Token("someToken");
            expect((accountService as any).checkCanSignUp(unknownViewer, "unused.email@test.com", "somePassword", token)).toBeTruthy();
        })

        test("Can not signUp without token", () => {
            const unknownViewer = new Viewer(new MockHeaders(undefined));
            const token = null;
            expect((accountService as any).checkCanSignUp(unknownViewer, "unused.email@test.com", "somePassword", token)).toBeFalsy();
        })
    })

    describe(".signIn", () => {
        test("Can sign in with existing email and correct password", async () => {
            expect.assertions(1);
            const unknownViewer = new Viewer(new MockHeaders(undefined));
            const result = await accountService.signIn(unknownViewer, "mockup01@test.com", "superSecretPassword01");
            return expect(result.token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+\/=]*)/); // // Match a JWT
        })

        test("Can not sign in without correct password", async () => {
            expect.assertions(1);
            const unknownViewer = new Viewer(new MockHeaders(undefined));
            const result = await accountService.signIn(unknownViewer, "mockup01@test.com", "wrongPassword");
            return expect(result).toBeNull();
        })

        test("Can not sign in without correct email", async () => {
            expect.assertions(1);
            const unknownViewer = new Viewer(new MockHeaders(undefined));
            const result = await accountService.signIn(unknownViewer, "mockup02@test.com", "superSecretPassword01");
            return expect(result).toBeNull();
        })
    })

    describe(".checkCanSignIn", () => {
        test("Returns true if entered password and login.password match", async () => {
            const unknownViewer = new Viewer(new MockHeaders(undefined));
            const login = new Login("1", "mockup01@test.com", "$2b$08$OBj8Oq3MB2K7VhAlpgVtBeesgLM6/a7WL5.tfFj3vFgSxRoSOYxxy", ["1"]);
            await expect(accountService.checkCanSignIn(unknownViewer, "mockup01@test.com", "superSecretPassword01", login)).resolves.toBeTruthy();
        })

        test("Returns false if entered password and login.password don't match", async () => {
            const unknownViewer = new Viewer(new MockHeaders(undefined));
            const login = new Login("1", "mockup01@test.com", "$2b$08$OBj8Oq3MB2K7VhAlpgVtBeesgLM6/a7WL5.tfFj3vFgSxRoSOYxxy", ["1"]);
            await expect(accountService.checkCanSignIn(unknownViewer, "mockup01@test.com", "superSetPassword02", login)).resolves.toBeFalsy();
        })
    })

})

