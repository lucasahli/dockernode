import {describe, expect, test} from '@jest/globals';
import {SignUpUseCaseHandler} from "../../../../../../src/core/components/userSessionContext/application/useCases/index.js";
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
import {SignUpProblem, SignUpSuccess} from "../../../../../../src/core/portsAndInterfaces/ports/SignUpUseCase.js";
import {MockHeaders, Viewer} from "../../../../../../src/core/sharedKernel/index.js";

describe("SignUpUseCaseHandler", () => {
    const repository = new MockupRepository();
    const accountService = new AccountService(
        new LoginService(repository, new PasswordManager(new BcryptHasher())),
        new UserService(repository), new PasswordManager(new BcryptHasher()),
        new DeviceService(repository),
        new SessionService(repository),
        new RefreshTokenService(repository)
    );
    const signUpUseCaseHandler = new SignUpUseCaseHandler(accountService);

    test("Can be instanciated", async () => {
        expect(signUpUseCaseHandler).toBeInstanceOf(SignUpUseCaseHandler);
    })

    describe(".execute", () => {
        test("SignUp works for an unregistered email and returns a SignUpResult", async () => {
            expect.assertions(1);
            const viewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const result: SignUpSuccess | SignUpProblem = await signUpUseCaseHandler.execute(viewer, "newEmail@test.com", "passwordTest", "Full Name Test");
            if (!(result instanceof SignUpProblem)) {
                return expect(result.accessToken.token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+\/=]*)/); // // Match a JWT
            }
        })

        test("can not create a login with an email that exists", async () => {
            expect.assertions(1);
            const viewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
            const signUpResult = await signUpUseCaseHandler.execute(viewer, "mockup01@test.com", "passwordTest", "Full Name");
            expect(signUpResult).toEqual({
                "invalidInputs": [{
                    "field": "EMAIL",
                    "message": "Email is already associated with a login"
                }], "title": "SignUp Problem"
            });
        })
    })
})