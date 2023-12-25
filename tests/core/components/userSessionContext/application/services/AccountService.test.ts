import {jest} from "@jest/globals";
import {describe, expect, test} from '@jest/globals';

import {PasswordManager} from "../../../../../../src/core/components/userSessionContext/domain/services/index.js";
import {AccountService, LoginService, UserService} from "../../../../../../src/core/components/userSessionContext/application/services/index.js";
import {MockHeaders, UserRole, Viewer} from "../../../../../../src/core/sharedKernel/index.js";
import {Login, User} from "../../../../../../src/core/components/userSessionContext/domain/entities/index.js";

import {MockupRepository} from "../../../../../../src/infrastructure/persistence/mockup/MockupRepository.js";
import {BcryptHasher} from "../../../../../../src/infrastructure/security/BcryptHasher.js";

import jwt from 'jsonwebtoken';
import {AccessToken} from "../../../../../../src/core/components/userSessionContext/domain/valueObjects/index.js";
import {SignUpProblem, SignUpSuccess} from "../../../../../../src/core/portsAndInterfaces/ports/SignUpUseCase.js";
import {DeviceService, RefreshTokenService, SessionService} from "../../../../../../src/core/components/userSessionContext/application/services/index.js";
import {SignInProblem, SignInSuccess} from "../../../../../../src/core/portsAndInterfaces/ports/SignInUseCase.js";

describe("AccountService", () => {
    const mockRepo = new MockupRepository();
    const accountService = new AccountService(
        new LoginService(mockRepo, new PasswordManager(new BcryptHasher())),
        new UserService(mockRepo), new PasswordManager(new BcryptHasher()),
        new DeviceService(mockRepo),
        new SessionService(mockRepo),
        new RefreshTokenService(mockRepo)
    );

    test("Can be instanciated", async () => {
        expect(accountService).toBeInstanceOf(AccountService);
    })

    describe(".signUp", () => {
        test("creates a new login for an unregistered email and returns a JWT", async () => {
            expect.assertions(1);
            const viewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const result: SignUpSuccess | SignUpProblem = await accountService.signUp(viewer, "newEmail@test.com", "passwordTest", "Full Name Test");
            if(!(result instanceof SignUpProblem)){
                return expect(result.accessToken.token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+\/=]*)/); // // Match a JWT
            }
        })

        test("can not create a login with an email that exists", async () => {
            expect.assertions(1);
            const viewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const signUpResult = await accountService.signUp(viewer, "mockup01@test.com", "passwordTest", "Full Name");
            expect(signUpResult).toEqual({"invalidInputs": [{"field": "EMAIL", "message": "Email is already associated with a login"}], "title": "SignUp Problem"});
        })
    })

    describe(".createToken", () => {
        test("creates a new token string when given a login with id and email and a user with a role", () => {
            const login = new Login("1", new Date(Date.now()), new Date(Date.now()),"mockup01@test.com", "superSecretPassword01", ["1"], [], []);
            const user = new User("1", new Date(Date.now()), new Date(Date.now()), login.id, UserRole.freemium, "Firstname01 Lastname01")
            expect((accountService as any).createAccessToken(login, user, process.env.SECRET!, '30m').token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+\/=]*)/); // Match a JWT
        })
    })

    describe(".checkCanSignUp", () => {
        test("Can signUp if a token was created", () => {
            const unknownViewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const token = new AccessToken("someToken");
            expect((accountService as any).checkCanSignUp(unknownViewer, "unused.email@test.com", "somePassword", "Full Name")).toBeTruthy();
        })

        test("Can not signUp with empty Full Name", () => {
            const unknownViewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const token = null;
            expect((accountService as any).checkCanSignUp(unknownViewer, "unused.email@test.com", "somePassword", "")).toBeFalsy();
        })
    })

    describe(".signIn", () => {
        test("Can sign in with existing email and correct password", async () => {
            expect.assertions(1);
            const unknownViewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const signInResult: SignInSuccess | SignInProblem = await accountService.signIn(unknownViewer, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)){
                return expect(signInResult?.accessToken.token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+\/=]*)/); // // Match a JWT
            }
        })

        test("Can not sign in without correct password", async () => {
            expect.assertions(1);
            const unknownViewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const signInResult: SignInSuccess | SignInProblem = await accountService.signIn(unknownViewer, "mockup01@test.com", "wrongPassword");
            return expect(signInResult).toEqual({"invalidInputs": [{"field": "PASSWORD", "message": "Wrong Password"}], "title": "SignIn Problem"});
        })

        test("Can not sign in without correct email", async () => {
            expect.assertions(1);
            const unknownViewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const result = await accountService.signIn(unknownViewer, "wrongmail.mockup02@test.com", "superSecretPassword01");
            return expect(result).toEqual({"invalidInputs": [{"field": "EMAIL", "message": "Email is not associated with a login"}], "title": "SignIn Problem"});
        })
    })

    describe(".checkCanSignIn", () => {
        test("Returns true if entered password and login.password match", async () => {
            const unknownViewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const login = new Login("1", new Date(Date.now()), new Date(Date.now()), "mockup01@test.com", "$2b$08$OBj8Oq3MB2K7VhAlpgVtBeesgLM6/a7WL5.tfFj3vFgSxRoSOYxxy", ["1"], ["1"], ["1"]);
            await expect(accountService.checkCanSignIn(unknownViewer, "mockup01@test.com", "superSecretPassword01", login)).resolves.toBeTruthy();
        })

        test("Returns false if entered password and login.password don't match", async () => {
            const unknownViewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const login = new Login("1", new Date(Date.now()), new Date(Date.now()), "mockup01@test.com", "$2b$08$OBj8Oq3MB2K7VhAlpgVtBeesgLM6/a7WL5.tfFj3vFgSxRoSOYxxy", ["1"], ["1"], ["1"]);
            await expect(accountService.checkCanSignIn(unknownViewer, "mockup01@test.com", "superSetPassword02", login)).resolves.toBeFalsy();
        })
    })

})

