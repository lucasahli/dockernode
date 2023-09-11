import {jest} from "@jest/globals";
import {MockupRepository} from "../../../../../infrastructure/persistence/mockup/MockupRepository.js";
import {PasswordManager} from "../../domain/services/index.js";
import {AccountService, LoginService, ReminderService, UserService} from "../../application/services/index.js";
import {MockHeaders, Viewer, UserRole} from "../../../../sharedKernel/index.js";
import {Reminder, User} from "../../domain/entities/index.js";
import {BcryptHasher} from "../../../../../infrastructure/security/BcryptHasher.js";

describe("ReminderService", () => {
    const mockRepo = new MockupRepository();
    const reminderService = new ReminderService(mockRepo);
    const accountService = new AccountService(
        new LoginService(mockRepo, new PasswordManager(new BcryptHasher())),
        new UserService(mockRepo), new PasswordManager(new BcryptHasher())
    );

    test("Can be instanced", () => {
        expect(reminderService).toBeInstanceOf(ReminderService);
    })

    describe(".generate", () => {
        const viewerUnknown = new Viewer(new MockHeaders(undefined));
        test("Generates if it exists in DB and canSee returns true", async () => {
            const token = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + token), process.env.SECRET);
            await expect(reminderService.generate(viewerAuthenticated, "1")).resolves.toBeInstanceOf(Reminder);
        })
        test("Returns Null if it does not exists in DB", async () => {
            const token = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + token), process.env.SECRET);
            await expect(reminderService.generate(viewerAuthenticated, "9")).resolves.toBeNull();
        })
    })

    describe(".checkCanSee", () => {

        const viewerUnknown = new Viewer(new MockHeaders(undefined),);

        const reminder = new Reminder("1", "title01", new Date("2011-10-01T14:48:00.000Z"), "1");
        test("Returns true if viewer has a valid token", async () => {
            const token = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + token), process.env.SECRET);
            expect(reminderService.checkCanSee(viewerAuthenticated, reminder)).toBeTruthy();
        })
        test("Returns always true even if viewer has not a valid token", async () => {
            expect(reminderService.checkCanSee(viewerUnknown, reminder)).toBeTruthy();
        })
    })

    describe(".checkCanCreate", () => {

        const viewerUnknown = new Viewer(new MockHeaders(undefined),);

        const reminder = new Reminder("1", "title01", new Date("2011-10-01T14:48:00.000Z"), "1");
        test("Returns true if viewer is logged in ", async () => {
            const token = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + token.token), process.env.SECRET);
            expect(reminderService.checkCanCreate(viewerAuthenticated, "ReminderTitle", new Date(), reminder)).toBeTruthy();
        })
        test("Returns false if viewer has not a valid token", async () => {
            expect(reminderService.checkCanCreate(viewerUnknown,"ReminderTitle", new Date(), reminder)).toBeFalsy();
        })
    })

    describe(".createReminder", () => {

        const viewerUnknown = new Viewer(new MockHeaders(undefined),);

        const reminder = new Reminder("1", "title01", new Date("2011-10-01T14:48:00.000Z"), "1");
        test("Returns the created reminder if it could be created", async () => {
            const token = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + token.token), process.env.SECRET);
            await viewerAuthenticated.prepareViewer();
            expect(reminderService.createReminder(viewerAuthenticated, "ReminderTitle", new Date())).resolves.toBeInstanceOf(Reminder);
        })
        test("Returns null if it could not be created", async () => {
            expect(reminderService.createReminder(viewerUnknown,"ReminderTitle", new Date())).resolves.toBeNull();
        })
    })

    describe(".checkCanDelete", () => {
        const viewerUnknown = new Viewer(new MockHeaders(undefined),"");
        const reminder = new Reminder("3", "title03", new Date("2011-10-01T14:48:00.000Z"), "1");
        test("Returns true if viewer owns the reminder", async () => {
            const token = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + token.token), process.env.SECRET);
            await viewerAuthenticated.prepareViewer();
            expect(reminderService.checkCanDelete(viewerAuthenticated, reminder)).toBeTruthy();
        })
        test("Returns false if viewer has not a valid token", async () => {
            expect(reminderService.checkCanDelete(viewerUnknown, reminder)).toBeFalsy();
        })
    })

    describe(".deleteReminder", () => {

        const viewerUnknown = new Viewer(new MockHeaders(undefined),);

        const reminder = new Reminder("1", "title01", new Date("2011-10-01T14:48:00.000Z"), "1");
        test("Returns true if it could be deleted", async () => {
            const token = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + token.token), process.env.SECRET);
            await viewerAuthenticated.prepareViewer();
            expect(reminderService.deleteReminder(viewerAuthenticated, "1")).resolves.toBeTruthy();
        })
        test("Returns false if it could not be deleted", async () => {
            expect(reminderService.deleteReminder(viewerUnknown,"1")).resolves.toBeFalsy();
        })
    })

    describe(".getRemindersByOwnerId", () => {

        const viewerUnknown = new Viewer(new MockHeaders(undefined),);

        test("Returns the reminders of the user in an array if there are some", async () => {
            const token = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + token.token), process.env.SECRET);
            await viewerAuthenticated.prepareViewer();
            expect(reminderService.getRemindersByOwnerId(viewerAuthenticated, "3")).resolves.toHaveLength(4);
        })
        test("Returns [] if the user does not have any reminders", async () => {
            expect(reminderService.getRemindersByOwnerId(viewerUnknown,"4")).resolves.toHaveLength(0);
        })
    })

})