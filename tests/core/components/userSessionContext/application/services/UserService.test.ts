import {jest} from "@jest/globals";
import {MockupRepository} from "../../../../../../src/infrastructure/persistence/mockup/MockupRepository.js";
import {UserService} from "../../../../../../src/core/components/userSessionContext/application/services/index.js";
import {MockHeaders, Viewer, UserRole} from "../../../../../../src/core/sharedKernel/index.js";
import {User, Login} from "../../../../../../src/core/components/userSessionContext/domain/entities/index.js";

describe("UserService", () => {
    const mockRepo = new MockupRepository();
    const userService = new UserService(mockRepo);

    test("Can be instanced", () => {
        expect(userService).toBeInstanceOf(UserService);
    })

    describe(".generate", () => {
        const viewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
        test("Generates if it exists in DB and canSee returns true", async () => {
            await expect(userService.generate(viewer, "1")).resolves.toBeInstanceOf(User);
        })
        test("Returns Null if it does not exists in DB", async () => {
            await expect(userService.generate(viewer, "9")).resolves.toBeNull();
        })
    })

    describe(".createFreemiumUser", () => {
        test("Creates a freemium user when given a login, firstname and lastname --> given that the login is not associated with a user", async () => {
            const login = new Login("1", new Date(Date.now()), new Date(Date.now()), "mockup01@test.com", "password01Safe", [], ["1"], ["1"]);
            new Login("7", new Date(Date.now()), new Date(Date.now()), "mockup07@test.com", "pw07TestPassword", ["1"], ["1"], ["1"])
            const fullName = "fullName Test";
            await expect(userService.createFreemiumUser(login, fullName)).resolves.toBeInstanceOf(User);
        })
        test("Creates a freemium user when given a login, firstname and lastname --> given that the login is not associated with a freemium user", async () => {
            const login = new Login("1", new Date(Date.now()), new Date(Date.now()), "mockup01@test.com", "password01Safe", ["7"], ["1"], ["1"]);
            const fullName = "fullName Test";
            await expect(userService.createFreemiumUser(login, fullName)).resolves.toBeInstanceOf(User);
        })
        test("Rejects when given a login, firstname and lastname --> given that the login is already associated with a freemium user", async () => {
            const login = new Login("1", new Date(Date.now()), new Date(Date.now()), "mockup01@test.com", "password01Safe", ["1"], ["1"], ["1"]);
            const fullName = "fullName Test";
            await expect(userService.createFreemiumUser(login, fullName)).rejects.toEqual("This login is already associated with a user with that role!!!");
        })
    })

    describe(".deleteUser", () => {
        const viewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
        test("Returns true if the user could be deleted", async () => {
            await expect(userService.deleteUser(viewer, "1")).resolves.toBeTruthy();
        })

        test("Returns false if the user could not be deleted", async () => {
            await expect(userService.deleteUser(viewer, "7")).resolves.toBeFalsy();
        })

        test("Returns false if no userI was given", async () => {
            await expect(userService.deleteUser(viewer, "")).resolves.toBeFalsy();
        })
    })

    describe(".checkCanCreateFreemiumUser", () => {
        const loginAssociatedWithFreemiumUser = new Login("1", new Date(Date.now()), new Date(Date.now()), "mockup01@test.com", "password01Safe", ["2"], ["1"], ["1"]);
        const loginWithoutUser = new Login("1", new Date(Date.now()), new Date(Date.now()), "mockup01@test.com", "password01Safe", [], ["1"], ["1"]);
        test("Returns true if the login is not yet associated with a freemium user", async () => {
            const res: boolean = await (userService as any).checkCanCreateFreemiumUser(loginWithoutUser);
            expect(res).toBeTruthy();
        })
        test("Returns false if the login is associated with a freemium user", async () => {
            const res: boolean = await (userService as any).checkCanCreateFreemiumUser(loginAssociatedWithFreemiumUser);
            expect(res).toBeFalsy();
        })
    })

    describe(".checkCanSee", () => {
        const viewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
        const login = new Login("3", new Date(Date.now()), new Date(Date.now()), "mockup03@test.com", "$2b$08$v0J1QjRiYvrmwoDTuKXK0.f06pFwmXXMM1D5cufuUROSAPzsigmH6", ["3"], ["1"], ["1"]);
        const user = new User("3", new Date(Date.now()), new Date(Date.now()), login.id, UserRole.freemium, "fullName01");
        test("Returns true", () => {
            expect((userService as any).checkCanSee(viewer, user)).toBeTruthy();
        })
    })

    describe(".checkCanDelete", () => {
        const viewer = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"));
        const login = new Login("3", new Date(Date.now()), new Date(Date.now()), "mockup03@test.com", "$2b$08$v0J1QjRiYvrmwoDTuKXK0.f06pFwmXXMM1D5cufuUROSAPzsigmH6", ["3"], ["1"], ["1"]);
        const user = new User("3", new Date(Date.now()), new Date(Date.now()), login.id, UserRole.freemium, "fullName01");
        test("Returns true", () => {
            expect((userService as any).checkCanDelete(viewer, user)).toBeTruthy();
        })
    })

})
