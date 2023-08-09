import {Login} from "./Login.js";
import {Reminder} from "./Reminder.js";
import {UserRole} from "../../../../sharedKernel/UserRole.js";

export class User {
    id: string;
    login: Login | null;
    role: UserRole;
    firstname: string;
    lastname: string;
    // reminders: [Reminder]

    constructor(id: string, login: Login | null, role: UserRole, firstname: string, lastname: string) {
        this.id = id;
        this.login = login;
        this.role = role;
        this.firstname = firstname;
        this.lastname = lastname;
    }
}