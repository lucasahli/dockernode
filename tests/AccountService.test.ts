import {describe, expect, test} from '@jest/globals';
import {AccountService} from "../src/core/components/reminderContext/domain/services/AccountService.js";
import {LoginService} from "../src/core/components/reminderContext/domain/services/LoginService.js";
import {UserService} from "../src/core/components/reminderContext/domain/services/UserService.js";
import {MockupRepository} from "../src/infrastructure/persistence/mockup/MockupRepository.js";
import {PasswordManager} from "../src/core/components/reminderContext/domain/services/PasswordManager.js";
import {BcryptHasher} from "../src/infrastructure/security/BcryptHasher.js";
import {Viewer} from "../src/core/sharedKernel/Viewer.js";
import {MockHeaders} from "../src/core/sharedKernel/MockHeaders.js";
import {Login} from "../src/core/components/reminderContext/domain/entities/Login.js";
import {User} from "../src/core/components/reminderContext/domain/entities/User.js";
import {UserRole} from "../src/core/sharedKernel/UserRole.js";
import jwt from 'jsonwebtoken';


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
            const viewer = new Viewer(new MockHeaders());
            const result = await accountService.signUp(viewer, "newEmail@test.com", "passwordTest");
            return expect(result).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+\/=]*)/); // // Match a JWT
        })

        test("can not create a login with an email that exists", async () => {
            expect.assertions(1);
            const viewer = new Viewer(new MockHeaders());
            const result = await accountService.signUp(viewer, "mockup01@test.com", "passwordTest");
            expect(result).toBeNull();
        })
    })

    describe(".createToken", () => {
        test("creates a new token string when given a login with id and email and a user with a role", () => {
            const login = new Login("1", "mockup01@test.com", "superSecretPassword01", ["1"]);
            const user = new User("1", login || null, UserRole.freemium, "Firstname01", "Lastname01")
            expect((accountService as any).createToken(login, user, process.env.SECRET!, '30m')).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+\/=]*)/) // Match a JWT
        })
    })

    describe(".checkCanSignUp", () => {
        test("Can signUp if a token was created", () => {
            const viewer = new Viewer(new MockHeaders());
            const token = "someToken";
            expect((accountService as any).checkCanSignUp(viewer, "unused.email@test.com", "somePassword", token)).toBeTruthy();
        })

        test("Can not signUp without token", () => {
            const viewer = new Viewer(new MockHeaders());
            const token = null;
            expect((accountService as any).checkCanSignUp(viewer, "unused.email@test.com", "somePassword", token)).toBeFalsy();
        })
    })

    describe(".signIn", () => {
        test("Can sign in with existing email and correct password", async () => {
            expect.assertions(1);
            const viewer = new Viewer(new MockHeaders());
            const result = await accountService.signIn(viewer, "mockup01@test.com", "superSecretPassword01");
            return expect(result).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+\/=]*)/); // // Match a JWT
        })

        test("Can not sign in without correct password", async () => {
            expect.assertions(1);
            const viewer = new Viewer(new MockHeaders());
            const result = await accountService.signIn(viewer, "mockup01@test.com", "wrongPassword");
            return expect(result).toBeNull();
        })

        test("Can not sign in without correct email", async () => {
            expect.assertions(1);
            const viewer = new Viewer(new MockHeaders());
            const result = await accountService.signIn(viewer, "mockup02@test.com", "superSecretPassword01");
            return expect(result).toBeNull();
        })
    })

    describe(".checkCanSignIn", () => {
        test("Returns true if entered password and login.password match", async () => {
            const viewer = new Viewer(new MockHeaders());
            const login = new Login("1", "mockup01@test.com", "$2b$08$OBj8Oq3MB2K7VhAlpgVtBeesgLM6/a7WL5.tfFj3vFgSxRoSOYxxy", ["1"]);
            await expect(accountService.checkCanSignIn(viewer, "mockup01@test.com", "superSecretPassword01", login)).resolves.toBeTruthy();
        })

        test("Returns false if entered password and login.password don't match", async () => {
            const viewer = new Viewer(new MockHeaders());
            const login = new Login("1", "mockup01@test.com", "$2b$08$OBj8Oq3MB2K7VhAlpgVtBeesgLM6/a7WL5.tfFj3vFgSxRoSOYxxy", ["1"]);
            await expect(accountService.checkCanSignIn(viewer, "mockup01@test.com", "superSetPassword02", login)).resolves.toBeFalsy();
        })
    })

})

