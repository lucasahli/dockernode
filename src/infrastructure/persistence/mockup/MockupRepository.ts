import {LoginRepository} from "../../../core/portsAndInterfaces/interfaces/LoginRepository.js";
import {UserRepository} from "../../../core/portsAndInterfaces/interfaces/UserRepository.js";
import {ReminderRepository} from "../../../core/portsAndInterfaces/interfaces/ReminderRepository.js";
import {Login} from "../../../core/components/userSessionContext/domain/entities/Login.js";
import {Reminder} from "../../../core/components/reminderContext/domain/entities/Reminder.js";
import {User} from "../../../core/components/userSessionContext/domain/entities/User.js";
import {UserRole} from "../../../core/sharedKernel/UserRole.js";
import {PasswordManager} from "../../../core/components/userSessionContext/domain/services/PasswordManager.js";
import {BcryptHasher} from "../../security/BcryptHasher.js";
import {Error} from "sequelize";
import {LocationWithRadius} from "../../../core/components/reminderContext/domain/entities/index.js";
import {
    DeviceRepository,
    RefreshTokenRepository,
    SessionRepository
} from "../../../core/portsAndInterfaces/interfaces/index.js";
import {Device, RefreshToken, Session} from "../../../core/components/userSessionContext/domain/entities/index.js";
import {DeviceType, SessionStatus} from "../../../core/components/userSessionContext/domain/valueObjects/index.js";

export class MockupRepository implements
    LoginRepository,
    UserRepository,
    ReminderRepository,
    DeviceRepository,
    SessionRepository,
    RefreshTokenRepository {

    getRefreshTokenIdByTokenString(tokenString: string): Promise<string | null> {
        // @ts-ignore
        throw new Error("Method not implemented.");
    }
    private passwordManager = new PasswordManager(new BcryptHasher());

    private logins: Login[] = [
        new Login("1", new Date(Date.now()), new Date(Date.now()), "mockup01@test.com", "$2b$08$OBj8Oq3MB2K7VhAlpgVtBeesgLM6/a7WL5.tfFj3vFgSxRoSOYxxy", ["1"], ["1"], ["1"]), //PW: superSecretPassword01
        new Login("2", new Date(Date.now()), new Date(Date.now()), "mockup02@test.com", "$2b$08$sZwh4hqfyc3LxI4NOtpY2e1iOxxxr9iTjk4QS21XWpnPrsflnm4Ni", ["2"], ["2"], ["2"]),
        new Login("3", new Date(Date.now()), new Date(Date.now()), "mockup03@test.com", "$2b$08$v0J1QjRiYvrmwoDTuKXK0.f06pFwmXXMM1D5cufuUROSAPzsigmH6", ["3"], ["3"], ["3"]),
    ];

    private reminders: Reminder[] = [
        new Reminder("1", new Date(Date.now()), new Date(Date.now()), "title01", "1", ["1"], false, new Date("2011-10-01T14:48:00.000Z")),
        new Reminder("2", new Date(Date.now()), new Date(Date.now()), "title02", "1", ["1"], false, new Date("2011-10-02T14:48:00.000Z")),
        new Reminder("3", new Date(Date.now()), new Date(Date.now()), "title03", "1", ["1"], false, new Date("2011-10-03T14:48:00.000Z")),
        new Reminder("4", new Date(Date.now()), new Date(Date.now()), "title04", "2", ["2"], false, new Date("2011-10-04T14:48:00.000Z")),
        new Reminder("5", new Date(Date.now()), new Date(Date.now()), "title05", "3", ["3"], false, new Date("2011-10-05T14:48:00.000Z")),
        new Reminder("6", new Date(Date.now()), new Date(Date.now()), "title06", "3", ["3"], false, new Date("2011-10-06T14:48:00.000Z")),
        new Reminder("7", new Date(Date.now()), new Date(Date.now()), "title07", "3", ["3"], false, new Date("2011-10-07T14:48:00.000Z")),
        new Reminder("8", new Date(Date.now()), new Date(Date.now()), "title08", "3", ["3"], false, new Date("2011-10-08T14:48:00.000Z")),
    ];

    private users: User[] = [
        new User("1", new Date(Date.now()), new Date(Date.now()), "1", UserRole.freemium, "Firstname01 Lastname01"),
        new User("2", new Date(Date.now()), new Date(Date.now()), "2", UserRole.freemium, "Firstname02 Lastname02"),
        new User("3", new Date(Date.now()), new Date(Date.now()), "3", UserRole.freemium, "Firstname03 Lastname03"),
    ];

    private devices: Device[] = [
        new Device("1", new Date(Date.now()), new Date(Date.now()), "DeviceIdentifier01", "userAgentString01", DeviceType.unknown, "DeviceName01", "DeviceOperatingSystem01", new Date(Date.now()), ["1"]),
        new Device("2", new Date(Date.now()), new Date(Date.now()), "DeviceIdentifier02", "userAgentString02", DeviceType.unknown, "DeviceName02", "DeviceOperatingSystem02", new Date(Date.now()), ["2"]),
        new Device("3", new Date(Date.now()), new Date(Date.now()), "DeviceIdentifier03", "userAgentString03", DeviceType.unknown, "DeviceName03", "DeviceOperatingSystem03", new Date(Date.now()), ["3"])
    ];

    private refreshTokens: RefreshToken[] = [
        new RefreshToken("1", new Date(Date.now()), new Date(Date.now()), "token", new Date(new Date(Date.now()).getDate() + 90), false, "1", "1"),
        new RefreshToken("2", new Date(Date.now()), new Date(Date.now()), "token", new Date(new Date(Date.now()).getDate() + 90), false, "2", "2"),
        new RefreshToken("3", new Date(Date.now()), new Date(Date.now()), "token", new Date(new Date(Date.now()).getDate() + 90), false, "3", "3"),
    ];

    private sessions: Session[] = [
        new Session("1", new Date(Date.now()), new Date(Date.now()), new Date(Date.now()), SessionStatus.active, new Date(), [], undefined, "1", "1", "1"),
        new Session("2", new Date(Date.now()), new Date(Date.now()), new Date(Date.now()), SessionStatus.active, new Date(), [],undefined, "2", "2", "2"),
        new Session("3", new Date(Date.now()), new Date(Date.now()), new Date(Date.now()), SessionStatus.active, new Date(), [],undefined, "3", "3", "3"),
    ]

    async printPWS() {
        for (let login of this.logins) {
            console.log(login.email, ": ", await this.passwordManager.hashPassword(login.password));
        }
    }

    createLogin(email: string, password: string, associatedUserIds: string[]): Promise<Login> {
        return Promise.resolve(new Login((this.logins.length + 1).toString(), new Date(Date.now()), new Date(Date.now()), email, password, associatedUserIds, [], []));
    }

    createReminder(title: string, ownerId: string, idsOfUsersToRemind: string[] = [ownerId], isCompleted: boolean = false, dateTimeToRemind?: Date, locationWithRadius?: LocationWithRadius): Promise<Reminder> {
        return Promise.resolve(new Reminder((this.reminders.length + 1).toString(), new Date(Date.now()), new Date(Date.now()), title, ownerId, [ownerId], false, dateTimeToRemind));
    }

    createUser(loginId: string, role: UserRole, fullName: string): Promise<User> {
        return Promise.resolve(new User((this.users.length + 1).toString(), new Date(Date.now()), new Date(Date.now()), loginId, role, fullName));
    }

    updateReminder(reminder: Reminder): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const index = this.reminders.findIndex(oneReminder => oneReminder.id === reminder.id);
            if (index !== -1) {
                this.reminders[index] = reminder; // Update the existing reminder in place
                resolve(true); // Resolve the promise indicating a successful update
            } else {
                reject('Reminder not found'); // Reject the promise if the reminder is not found
            }
        });
    }

    deleteLogin(id: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            const index = this.logins.findIndex(item => item.id === id);
            if (index > -1) {
                this.logins.splice(index, 1);
                return resolve(true);
            }
            reject(false);
        });
    }

    deleteReminder(id: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            const index = this.reminders.findIndex(item => item.id === id);
            if (index > -1) {
                this.reminders.splice(index, 1);
                return resolve(true);
            }
            reject(false);
        });
    }

    deleteUser(id: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            const index = this.users.findIndex(item => item.id === id);
            if (index > -1) {
                this.users.splice(index, 1);
                return resolve(true);
            }
            reject(false);
        });
    }


    getLoginByEmail(email: string): Promise<Login | null> {
        return Promise.resolve(this.logins.find(item => item.email === email) || null);
    }

    getLoginById(id: string): Promise<Login | null> {
        return Promise.resolve(this.logins.find(item => item.id === id) || null);
    }

    getReminderById(id: string): Promise<Reminder | null> {
        return Promise.resolve(this.reminders.find(item => item.id === id) || null);
    }

    getReminderIdsByOwnerId(ownerId: string): Promise<string[]> {
        const reminders = this.reminders.filter(item => item.ownerId === ownerId);
        if (reminders.length > 0){
            return Promise.resolve(reminders.map(reminder => reminder.id));
        }
        return Promise.resolve([]);
    }

    getUserById(id: string): Promise<User | null> {
        return Promise.resolve(this.users.find(item => item.id === id) || null);
    }

    getAllReminderIds(): Promise<string[] | null> {
        return Promise.resolve(this.reminders.map(reminder => reminder.id));
    }

    getAllUserIds(): Promise<string[] | null> {
        return Promise.resolve(this.users.map(user => user.id));
    }

    getManyUsersByIds(ids: string[]): Promise<(User | Error | null)[]> {
        return Promise.resolve([]);
    }

    createDevice(deviceIdentifier: string, userAgentString: string, deviceType: DeviceType, deviceName: string, deviceOperatingSystem: string, lastUsed: Date, associatedSessionIds: string[]): Promise<Device> {
        return Promise.resolve(new Device(
            (this.devices.length + 1).toString(),
            new Date(Date.now()),
            new Date(Date.now()),
            deviceIdentifier,
            userAgentString,
            deviceType,
            deviceName,
            deviceOperatingSystem,
            lastUsed,
            associatedSessionIds
            ));
    }

    createRefreshToken(token: string, expiration: Date, revoked: boolean, associatedLoginId: string, associatedDeviceId: string): Promise<RefreshToken> {
        return Promise.resolve(new RefreshToken(
            (this.refreshTokens.length + 1).toString(),
            new Date(Date.now()),
            new Date(Date.now()),
            token,
            expiration,
            revoked,
            associatedLoginId,
            associatedDeviceId
        ));
    }

    createSession(startTime: Date, sessionStatus: SessionStatus, associatedSessionActivityIds: string[], endTime?: Date, associatedDeviceId?: string, associatedLoginId?: string, associatedRefreshTokenId?: string): Promise<Session> {
        return Promise.resolve(new Session(
            (this.sessions.length + 1).toString(),
            new Date(Date.now()),
            new Date(Date.now()),
            startTime,
            sessionStatus,
            new Date(),
            associatedSessionActivityIds,
            endTime,
            associatedDeviceId,
            associatedLoginId,
            associatedRefreshTokenId
        ));
    }

    deleteDevice(id: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            const index = this.devices.findIndex(item => item.id === id);
            if (index > -1) {
                this.devices.splice(index, 1);
                return resolve(true);
            }
            reject(false);
        });
    }

    deleteRefreshToken(id: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            const index = this.refreshTokens.findIndex(item => item.id === id);
            if (index > -1) {
                this.refreshTokens.splice(index, 1);
                return resolve(true);
            }
            reject(false);
        });
    }

    deleteSession(id: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            const index = this.sessions.findIndex(item => item.id === id);
            if (index > -1) {
                this.sessions.splice(index, 1);
                return resolve(true);
            }
            reject(false);
        });
    }

    getAllDeviceIds(): Promise<string[] | null> {
        return Promise.resolve(this.devices.map(entity => entity.id));
    }

    getAllRefreshTokenIds(): Promise<string[] | null> {
        return Promise.resolve(this.refreshTokens.map(entity => entity.id));
    }

    getAllSessionIds(): Promise<string[] | null> {
        return Promise.resolve(this.sessions.map(entity => entity.id));
    }

    getDeviceIdByDeviceIdentifier(deviceIdentifier: string): Promise<string | null> {
        const foundDevice = this.devices.find(item => item.deviceIdentifier === deviceIdentifier);
        if(foundDevice){
            return Promise.resolve(foundDevice.id)
        }
        return Promise.resolve(null);
    }

    getDeviceById(id: string): Promise<Device | null> {
        return Promise.resolve(this.devices.find(item => item.id === id) || null);
    }

    getManyDevicesByIds(ids: string[]): Promise<(Device | Error | null)[]> {
        return Promise.resolve([]);
    }

    getManyRefreshTokensByIds(ids: string[]): Promise<(RefreshToken | Error | null)[]> {
        return Promise.resolve([]);
    }

    getManySessionsByIds(ids: string[]): Promise<(Session | Error | null)[]> {
        return Promise.resolve([]);
    }

    getRefreshTokenById(id: string): Promise<RefreshToken | null> {
        return Promise.resolve(this.refreshTokens.find(item => item.id === id) || null);
    }

    getSessionById(id: string): Promise<Session | null> {
        return Promise.resolve(this.sessions.find(item => item.id === id) || null);
    }

    updateDevice(updatedDevice: Device): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const index = this.devices.findIndex(item => item.id === updatedDevice.id);
            if (index !== -1) {
                this.devices[index] = updatedDevice; // Update the existing reminder in place
                resolve(true); // Resolve the promise indicating a successful update
            } else {
                reject('Mock Device not found'); // Reject the promise if the reminder is not found
            }
        });
    }

    updateRefreshToken(updatedRefreshToken: RefreshToken): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const index = this.refreshTokens.findIndex(item => item.id === updatedRefreshToken.id);
            if (index !== -1) {
                this.refreshTokens[index] = updatedRefreshToken; // Update the existing reminder in place
                resolve(true); // Resolve the promise indicating a successful update
            } else {
                reject('Mock RefreshToken not found'); // Reject the promise if the reminder is not found
            }
        });
    }

    updateSession(updatedSession: Session): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const index = this.sessions.findIndex(item => item.id === updatedSession.id);
            if (index !== -1) {
                this.sessions[index] = updatedSession; // Update the existing reminder in place
                resolve(true); // Resolve the promise indicating a successful update
            } else {
                reject('Mock Session not found'); // Reject the promise if the reminder is not found
            }
        });
    }

}