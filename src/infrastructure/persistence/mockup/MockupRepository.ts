import {LoginRepository} from "../../../core/portsAndInterfaces/interfaces/LoginRepository.js";
import {UserRepository} from "../../../core/portsAndInterfaces/interfaces/UserRepository.js";
import {ReminderRepository} from "../../../core/portsAndInterfaces/interfaces/ReminderRepository.js";
import {Login} from "../../../core/components/reminderContext/domain/entities/Login.js";
import {Reminder} from "../../../core/components/reminderContext/domain/entities/Reminder.js";
import {User} from "../../../core/components/reminderContext/domain/entities/User.js";
import {UserRole} from "../../../core/sharedKernel/UserRole.js";
import {PasswordManager} from "../../../core/components/reminderContext/domain/services/PasswordManager.js";
import {BcryptHasher} from "../../security/BcryptHasher.js";
import login from "../../../presentation/graphQL/resolvers/login.js";
import {Error} from "sequelize";
import reminder from "../../../presentation/graphQL/resolvers/reminder.js";
import {LocationWithRadius} from "../../../core/components/reminderContext/domain/entities/index.js";

export class MockupRepository implements LoginRepository, UserRepository, ReminderRepository {
    private passwordManager = new PasswordManager(new BcryptHasher());

    private logins: Login[] = [
        new Login("1", "mockup01@test.com", "$2b$08$OBj8Oq3MB2K7VhAlpgVtBeesgLM6/a7WL5.tfFj3vFgSxRoSOYxxy", ["1"]), //PW: superSecretPassword01
        new Login("2", "mockup02@test.com", "$2b$08$sZwh4hqfyc3LxI4NOtpY2e1iOxxxr9iTjk4QS21XWpnPrsflnm4Ni", ["2"]),
        new Login("3", "mockup03@test.com", "$2b$08$v0J1QjRiYvrmwoDTuKXK0.f06pFwmXXMM1D5cufuUROSAPzsigmH6", ["3"]),
    ];

    private reminders: Reminder[] = [
        new Reminder("1", "title01", "1", ["1"], false, new Date("2011-10-01T14:48:00.000Z")),
        new Reminder("2", "title02", "1", ["1"], false, new Date("2011-10-02T14:48:00.000Z")),
        new Reminder("3", "title03", "1", ["1"], false, new Date("2011-10-03T14:48:00.000Z")),
        new Reminder("4", "title04", "2", ["2"], false, new Date("2011-10-04T14:48:00.000Z")),
        new Reminder("5", "title05", "3", ["3"], false, new Date("2011-10-05T14:48:00.000Z")),
        new Reminder("6", "title06", "3", ["3"], false, new Date("2011-10-06T14:48:00.000Z")),
        new Reminder("7", "title07", "3", ["3"], false, new Date("2011-10-07T14:48:00.000Z")),
        new Reminder("8", "title08", "3", ["3"], false, new Date("2011-10-08T14:48:00.000Z")),
    ];

    private users: User[] = [
        new User("1", "1", UserRole.freemium, "Firstname01" + " " + "Lastname01"),
        new User("2", "2", UserRole.freemium, "Firstname02" + " " + "Lastname02"),
        new User("3", "3", UserRole.freemium, "Firstname03" + " " + "Lastname03"),
    ];

    async printPWS() {
        for (let login of this.logins) {
            console.log(login.email, ": ", await this.passwordManager.hashPassword(login.password));
        }
    }

    createLogin(email: string, password: string, associatedUserIds: string[]): Promise<Login> {
        return Promise.resolve(new Login((this.logins.length + 1).toString(), email, password, associatedUserIds));
    }

    createReminder(title: string, ownerId: string, idsOfUsersToRemind: string[] = [ownerId], isCompleted: boolean = false, dateTimeToRemind?: Date, locationWithRadius?: LocationWithRadius): Promise<Reminder> {
        return Promise.resolve(new Reminder((this.reminders.length + 1).toString(), title, ownerId, [ownerId], false, dateTimeToRemind));
    }

    createUser(loginId: string, role: UserRole, fullName: string): Promise<User> {
        return Promise.resolve(new User((this.users.length + 1).toString(), loginId, role, fullName));
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

}