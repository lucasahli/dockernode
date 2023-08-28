import {jest} from "@jest/globals";
import {MockupRepository} from "../../../../../infrastructure/persistence/mockup/MockupRepository.js";
import {LoginService, PasswordManager} from "./index.js";
import {BcryptHasher} from "../../../../../infrastructure/security/BcryptHasher.js";
import {MockHeaders, Viewer} from "../../../../sharedKernel/index.js";
import {Login} from "../entities/index.js";


describe("LoginService", () => {
    const mockRepo = new MockupRepository();
    const loginService = new LoginService(mockRepo, new PasswordManager(new BcryptHasher()));

    test("Can be instanced", () => {
        expect(loginService).toBeInstanceOf(LoginService);
    })

    describe(".generate", () => {
        const viewer = new Viewer(new MockHeaders());
        test("Generates if it exists in DB and canSee returns true", async () => {
            await expect(loginService.generate(viewer, "1")).resolves.toBeInstanceOf(Login);
        })
        test("Returns Null if it does not exists in DB", async () => {
            await expect(loginService.generate(viewer, "9")).resolves.toBeNull();
        })
    })

    describe(".createNewLogin", () => {
        const viewer = new Viewer(new MockHeaders());
        test("Any viewer can create a new login with an unused email and a valid password", async () => {
            const createdLogin = await loginService.createNewLogin(viewer, "newEmail@test.com", "passwordTest");
            expect(createdLogin).toBeInstanceOf(Login);
        })

        test("Can't create a new login with a used email", async () => {
            return expect(loginService.createNewLogin(viewer, "mockup01@test.com", "passwordTest")).rejects.toEqual("Login with that email already exists!!!");
        })
    })

    describe(".getLoginByEmail",() => {
        test("Returns login when that email address is associated with one", async () => {
            const resultingLogin = await loginService.getLoginByEmail("mockup01@test.com");
            expect(resultingLogin).toBeInstanceOf(Login);
            expect(resultingLogin?.email).toEqual("mockup01@test.com");
        })

        test("Returns null if the email is not associated with a login", async () => {
            const resultingLogin = await loginService.getLoginByEmail("unknown@test.com");
            expect(resultingLogin).toBeNull();
        })
    })

    describe(".deleteLogin", () => {
        const viewer = new Viewer(new MockHeaders());
        test("Can delete login if it exists", async () => {
            await expect(loginService.deleteLogin(viewer, "1")).resolves.toBeTruthy();
        })
        test("Can not delete login if it does not exists", async () => {
            await expect(loginService.deleteLogin(viewer, "9")).resolves.toBeFalsy();
        })
    })

    describe(".checkCanSee", () => {
        const viewer = new Viewer(new MockHeaders());
        const login = new Login("7", "mockup07@test.com", "pw07TestPassword", []);
        test("Returns true", () => {
            expect((loginService as any).checkCanSee(viewer, login)).toBeTruthy();
        })
    })

    describe(".checkCanDelete", () => {
        const viewer = new Viewer(new MockHeaders());
        const login = new Login("7", "mockup07@test.com", "pw07TestPassword", []);
        test("Returns true", () => {
            expect((loginService as any).checkCanDelete(viewer, login)).toBeTruthy();
        })
    })
})