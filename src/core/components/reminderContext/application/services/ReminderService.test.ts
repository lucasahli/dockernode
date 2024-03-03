import {jest} from "@jest/globals";
import {MockupRepository} from "../../../../../infrastructure/persistence/mockup/MockupRepository.js";
import {PasswordManager} from "../../../userSessionContext/domain/services/index.js";
import { ReminderService} from "../../application/services/index.js";
import {MockHeaders, Viewer} from "../../../../sharedKernel/index.js";
import {Reminder} from "../../domain/entities/index.js";
import {BcryptHasher} from "../../../../../infrastructure/security/BcryptHasher.js";
import {SignInProblem, SignInResult, SignInSuccess} from "../../../../portsAndInterfaces/ports/SignInUseCase.js";
import {CreateReminderProblem} from "../../../../portsAndInterfaces/ports/CreateReminderUseCase.js";
import {
    AccountService,
    DeviceService, LoginService,
    RefreshTokenService,
    SessionService, UserService
} from "../../../userSessionContext/application/services/index.js";

describe("ReminderService", () => {
    const mockRepo = new MockupRepository();
    const reminderService = new ReminderService(mockRepo);
    const accountService = new AccountService(
        new LoginService(mockRepo, new PasswordManager(new BcryptHasher())),
        new UserService(mockRepo), new PasswordManager(new BcryptHasher()),
        new DeviceService(mockRepo),
        new SessionService(mockRepo),
        new RefreshTokenService(mockRepo)
    );

    test("Can be instanced", () => {
        expect(reminderService).toBeInstanceOf(ReminderService);
    })

    describe(".generate", () => {
        const viewerUnknown = new Viewer(new MockHeaders(undefined, "SomeUserAgent"));
        test("Generates if it exists in DB and canSee returns true", async () => {
            const signInResult: SignInSuccess | SignInProblem = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.HASH_SECRET);
                await expect(reminderService.generate(viewerAuthenticated, "1")).resolves.toBeInstanceOf(Reminder);
            }

        })
        test("Returns Null if it does not exists in DB", async () => {
            const signInResult: SignInSuccess | SignInProblem = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.HASH_SECRET);
                await expect(reminderService.generate(viewerAuthenticated, "9")).resolves.toBeNull();
            }

        })
    })

    describe(".checkCanSee", () => {

        const viewerUnknown = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"),);

        const reminder = new Reminder("1", new Date("2020-10-01T14:48:00.000Z"), new Date("2025-10-01T14:48:00.000Z"), "title01", "1", ["1"], false, new Date("2011-10-01T14:48:00.000Z"));
        test("Returns true if viewer has a valid token", async () => {
            const signInResult: SignInSuccess | SignInProblem = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.HASH_SECRET);
                expect(reminderService.checkCanSee(viewerAuthenticated, reminder)).toBeTruthy();
            }

        })
        test("Returns always true even if viewer has not a valid token", async () => {
            expect(reminderService.checkCanSee(viewerUnknown, reminder)).toBeTruthy();
        })
    })

    describe(".checkCanCreate", () => {

        const viewerUnknown = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"),);

        const reminder = new Reminder("1", new Date("2020-10-01T14:48:00.000Z"), new Date("2025-10-01T14:48:00.000Z"), "title01", "1", ["1"], false, new Date("2030-10-01T14:48:00.000Z"));
        test("Returns true if viewer is logged in and reminder is timed in the future ", async () => {
            const signInResult: SignInSuccess | SignInProblem = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.HASH_SECRET);
                expect(reminderService.checkCanCreate(viewerAuthenticated, reminder.title, reminder.dateTimeToRemind!)).toBeTruthy();
            }

        })
        test("Returns CreateReminderProblem if viewer has not a valid token", async () => {
            expect(reminderService.checkCanCreate(viewerUnknown, reminder.title, reminder.dateTimeToRemind!)).toBeInstanceOf(CreateReminderProblem);
        })
    })

    describe(".createReminder", () => {

        const viewerUnknown = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"),);

        test("Returns the created reminder if it could be created", async () => {
            const signInResult: SignInResult = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.HASH_SECRET);
                await viewerAuthenticated.prepareViewer();
                expect(reminderService.createReminder(viewerAuthenticated, "ReminderTitle", new Date("2030-10-01T14:48:00.000Z"))).resolves.toMatchObject({createdReminder: {}});
            }

        })
        test("Returns null if it could not be created", async () => {
            expect(reminderService.createReminder(viewerUnknown,"ReminderTitle", new Date())).resolves.toEqual({"invalidInputs": [], "title": "Not signed in: Sign in to create a reminder"});
        })
    })

    describe(".checkCanDelete", () => {
        const viewerUnknown = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"),"");
        const reminder = new Reminder("3", new Date(Date.now()), new Date(Date.now()), "title03", "1", ["1"], false, new Date("2011-10-01T14:48:00.000Z"));
        test("Returns true if viewer owns the reminder", async () => {
            const signInResult = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + signInResult?.accessToken.token, "SomeUserAgentString"), process.env.HASH_SECRET);
                await viewerAuthenticated.prepareViewer();
                const canDelete = reminderService.checkCanDelete(viewerAuthenticated, reminder);
                expect(canDelete).toBeTruthy();
            }

        })
        test("Returns false if viewer has not a valid token", async () => {
            expect(reminderService.checkCanDelete(viewerUnknown, reminder)).toBeFalsy();
        })
    })

    describe(".deleteReminder", () => {

        const viewerUnknown = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"),);

        test("Returns true if it could be deleted", async () => {
            const signInResult: SignInResult = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.HASH_SECRET);
                await viewerAuthenticated.prepareViewer();
                expect(reminderService.deleteReminder(viewerAuthenticated, "1")).resolves.toBeTruthy();
            }

        })
        test("Returns false if it could not be deleted", async () => {
            expect(reminderService.deleteReminder(viewerUnknown,"1")).resolves.toBeFalsy();
        })
    })

    describe(".getRemindersByOwnerId", () => {

        const viewerUnknown = new Viewer(new MockHeaders(undefined, "SomeUserAgentString"),);

        test("Returns the reminders of the user in an array if there are some", async () => {
            const signInResult: SignInResult = await accountService.signIn(viewerUnknown, "mockup01@test.com", "superSecretPassword01");
            if (!(signInResult instanceof SignInProblem)) {
                const viewerAuthenticated = new Viewer(new MockHeaders("Bearer " + signInResult.accessToken.token, "SomeUserAgentString"), process.env.HASH_SECRET);
                await viewerAuthenticated.prepareViewer();
                expect(reminderService.getRemindersByOwnerId(viewerAuthenticated, "3")).resolves.toHaveLength(4);
            }

        })
        test("Returns [] if the user does not have any reminders", async () => {
            expect(reminderService.getRemindersByOwnerId(viewerUnknown,"4")).resolves.toHaveLength(0);
        })
    })

})