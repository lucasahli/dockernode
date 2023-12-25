import {expect, jest} from "@jest/globals";
import {MockHeaders, UserRole, Viewer} from "./index.js";
import {
    AccountService,
    LoginService,
    UserService
} from "../components/userSessionContext/application/services/index.js";
import {PasswordManager} from "../components/userSessionContext/domain/services/index.js";
import {BcryptHasher} from "../../infrastructure/security/BcryptHasher.js";
import {MockupRepository} from "../../infrastructure/persistence/mockup/MockupRepository.js";
import {
    DeviceService,
    RefreshTokenService,
    SessionService
} from "../components/userSessionContext/application/services/index.js";
import {SignInProblem, SignInResult, SignInSuccess} from "../portsAndInterfaces/ports/SignInUseCase.js";

describe("Viewer", () => {
    const unknownViewer = new Viewer(new MockHeaders(undefined, "Some Mock User Agent string"));
    const mockRepo = new MockupRepository();
    const accountService = new AccountService(
        new LoginService(mockRepo, new PasswordManager(new BcryptHasher())),
        new UserService(mockRepo), new PasswordManager(new BcryptHasher()),
        new DeviceService(mockRepo),
        new SessionService(mockRepo),
        new RefreshTokenService(mockRepo)
    );

    test("Can be instanced without authorization header", async () => {
        expect(unknownViewer).toBeInstanceOf(Viewer);
    })

    test("Can be instanced with authorization header", async () => {
        const signInResult: SignInProblem | SignInSuccess = await accountService.signIn(unknownViewer, "mockup01@test.com", "superSecretPassword01");
        if (!(signInResult instanceof SignInProblem)) {
            const authenticatedViewer = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.SECRET);
            expect(authenticatedViewer).toBeInstanceOf(Viewer);
        }

    })

    describe(".getPayloadFromToken", () => {
        test("Returns the payload if the token can be decoded", async () => {
            const signInResult: SignInResult = await accountService.signIn(unknownViewer, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const authenticatedViewer = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.SECRET);
                expect(authenticatedViewer.getPayloadFromToken()).toHaveProperty("loginId", "1");
            }

        });

        test("Returns null if the authorization header is undefined", async () => {
            expect(unknownViewer.getPayloadFromToken()).toBeNull();
        });
    })

    describe(".hasValidToken", () => {
        test("Returns true if the token is valid", async () => {
            const signInResult: SignInResult = await accountService.signIn(unknownViewer, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const authenticatedViewer = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.SECRET);
                expect(authenticatedViewer.hasValidToken()).toBeTruthy();
            }

        });

        test("Returns false if there is no authorization header", async () => {
            expect(unknownViewer.hasValidToken()).toBeFalsy();
        });
    })

    describe(".prepareViewer", () => {
        test("A prepared Viewer has a loginId", async () => {
            expect.assertions(2);
            const signInResult: SignInResult = await accountService.signIn(unknownViewer, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const authenticatedViewer = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.SECRET);
                await authenticatedViewer.prepareViewer();
                expect(authenticatedViewer.loginId).toBeDefined();
                expect(authenticatedViewer.loginId).toBe("1");
            }

        });

        test("A prepared Viewer has a loginEmail", async () => {
            expect.assertions(2);
            const signInResult: SignInResult = await accountService.signIn(unknownViewer, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const authenticatedViewer = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.SECRET);
                await authenticatedViewer.prepareViewer();
                expect(authenticatedViewer.loginEmail).toBeDefined();
                expect(authenticatedViewer.loginEmail).toBe("mockup01@test.com");
            }

        });

        test("A prepared Viewer has a userId", async () => {
            expect.assertions(2);
            const signInResult: SignInResult = await accountService.signIn(unknownViewer, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const authenticatedViewer = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.SECRET);
                await authenticatedViewer.prepareViewer();
                expect(authenticatedViewer.userId).toBeDefined();
                expect(authenticatedViewer.userId).toBe("1");
            }

        });

        test("A prepared Viewer has a userRole", async () => {
            expect.assertions(2);
            const signInResult: SignInResult = await accountService.signIn(unknownViewer, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const authenticatedViewer = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.SECRET);
                await authenticatedViewer.prepareViewer();
                expect(authenticatedViewer.userRole).toBeDefined();
                expect(authenticatedViewer.userRole).toBe(UserRole.freemium);
            }

        });

    })

    describe(".isLoggedIn", () => {
        test("Returns true if the token is valid", async () => {
            const signInResult: SignInResult = await accountService.signIn(unknownViewer, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const authenticatedViewer = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.SECRET);
                expect(authenticatedViewer.isLoggedIn()).toBeTruthy();
            }

        });

        test("Returns false if there is no authorization header", async () => {
            expect(unknownViewer.isLoggedIn()).toBeFalsy();
        });
    })

})