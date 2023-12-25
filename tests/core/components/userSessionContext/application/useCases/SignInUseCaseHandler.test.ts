import {describe, expect, test} from '@jest/globals';
import {SignInUseCaseHandler} from "../../../../../../src/core/components/userSessionContext/application/useCases/index.js";
import {MockupRepository} from "../../../../../../src/infrastructure/persistence/mockup/MockupRepository.js";
import {PasswordManager} from "../../../../../../src/core/components/userSessionContext/domain/services/index.js";
import {BcryptHasher} from "../../../../../../src/infrastructure/security/BcryptHasher.js";
import {
    DeviceService, RefreshTokenService,
    SessionService,
    AccountService,
    LoginService,
    UserService
} from "../../../../../../src/core/components/userSessionContext/application/services/index.js";
import {SignInProblem, SignInSuccess} from "../../../../../../src/core/portsAndInterfaces/ports/SignInUseCase.js";
import {MockHeaders, Viewer} from "../../../../../../src/core/sharedKernel/index.js";

describe("SignInUseCaseHandler", () => {
    const repository = new MockupRepository();
    const accountService = new AccountService(
        new LoginService(repository, new PasswordManager(new BcryptHasher())),
        new UserService(repository), new PasswordManager(new BcryptHasher()),
        new DeviceService(repository),
        new SessionService(repository),
        new RefreshTokenService(repository)
    );
    const signInUseCaseHandler = new SignInUseCaseHandler(accountService);

    test("Can be instanciated", async () => {
        expect(signInUseCaseHandler).toBeInstanceOf(SignInUseCaseHandler);
    })

    describe(".execute", () => {
        test("SignIn works for a registered email+password and returns a SignInResult", async () => {
            expect.assertions(1);
            const viewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const result: SignInSuccess | SignInProblem = await signInUseCaseHandler.execute(viewer, "mockup01@test.com", "superSecretPassword01");
            if (!(result instanceof SignInProblem)) {
                return expect(result.accessToken.token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+\/=]*)/); // // Match a JWT
            }
        })

        test("can not sign in with a wrong password", async () => {
            expect.assertions(1);
            const viewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const signUpResult = await signInUseCaseHandler.execute(viewer, "mockup01@test.com", "wrongPassword");
            expect(signUpResult).toEqual({
                "invalidInputs": [{
                    "field": "PASSWORD",
                    "message": "Wrong Password"
                }], "title": "SignIn Problem"
            });
        })
    })
})