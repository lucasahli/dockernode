import {jest} from "@jest/globals";
import {MockupRepository} from "../../../../../infrastructure/persistence/mockup/MockupRepository.js";
import {UserService} from "./index.js";
import {MockHeaders, Viewer, UserRole} from "../../../../sharedKernel/index.js";
import {User, Login} from "../entities/index.js";

describe("UserService", () => {
    const mockRepo = new MockupRepository();
    const userService = new UserService(mockRepo);

    test("Can be instanciated", () => {
        expect(userService).toBeInstanceOf(UserService);
    })

    describe(".generate", () => {
        const viewer = new Viewer(new MockHeaders());
        test("Generates if it exists in DB and canSee returns true", async () => {
            await expect(userService.generate(viewer, "1")).resolves.toBeInstanceOf(User);
        })
        test("Returns Null if it does not exists in DB", async () => {
            await expect(userService.generate(viewer, "9")).resolves.toBeNull();
        })
    })

    describe(".createFreemiumUser", () => {
        test("Creates a freemium user when given a login, firstname and lastname --> given that the login is not associated with a user", async () => {
            const login = new Login("1", "mockup01@test.com", "password01Safe", []);
            const firstname = "firstnameTest";
            const lastname = "lastnameTest";
            await expect(userService.createFreemiumUser(login, firstname, lastname)).resolves.toBeInstanceOf(User);
        })
        test("Creates a freemium user when given a login, firstname and lastname --> given that the login is not associated with a freemium user", async () => {
            const login = new Login("1", "mockup01@test.com", "password01Safe", ["7"]);
            const firstname = "firstnameTest";
            const lastname = "lastnameTest";
            await expect(userService.createFreemiumUser(login, firstname, lastname)).resolves.toBeInstanceOf(User);
        })
        test("Rejects when given a login, firstname and lastname --> given that the login is already associated with a freemium user", async () => {
            const login = new Login("1", "mockup01@test.com", "password01Safe", ["1"]);
            const firstname = "firstnameTest";
            const lastname = "lastnameTest";
            await expect(userService.createFreemiumUser(login, firstname, lastname)).rejects.toEqual("This login is already associated with a user with that role!!!");
        })
    })

    describe(".deleteUser", () => {
        const viewer = new Viewer(new MockHeaders());
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
        const loginAssociatedWithFreemiumUser = new Login("1", "mockup01@test.com", "password01Safe", ["2"]);
        const loginWithoutUser = new Login("1", "mockup01@test.com", "password01Safe", []);
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
        const viewer = new Viewer(new MockHeaders());
        const login = new Login("3", "mockup03@test.com", "$2b$08$v0J1QjRiYvrmwoDTuKXK0.f06pFwmXXMM1D5cufuUROSAPzsigmH6", ["3"]);
        const user = new User("3", login.id, UserRole.freemium, "Firstname01", "Lastname01");
        test("Returns true", () => {
            expect((userService as any).checkCanSee(viewer, user)).toBeTruthy();
        })
    })

    describe(".checkCanDelete", () => {
        const viewer = new Viewer(new MockHeaders());
        const login = new Login("3", "mockup03@test.com", "$2b$08$v0J1QjRiYvrmwoDTuKXK0.f06pFwmXXMM1D5cufuUROSAPzsigmH6", ["3"]);
        const user = new User("3", login.id, UserRole.freemium, "Firstname01", "Lastname01");
        test("Returns true", () => {
            expect((userService as any).checkCanDelete(viewer, user)).toBeTruthy();
        })
    })

})
