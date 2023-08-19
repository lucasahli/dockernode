import {Login} from "./Login.js";
import {Reminder} from "./Reminder.js";
import {UserRole} from "../../../../sharedKernel/UserRole.js";

export class User {
    id: string;
    associatedLoginId: string;
    role: UserRole;
    firstname: string;
    lastname: string;
    // reminders: [Reminder]

    constructor(id: string, associatedLoginId: string, role: UserRole, firstname: string, lastname: string) {
        this.id = id;
        this.associatedLoginId = associatedLoginId;
        this.role = role;
        this.firstname = firstname;
        this.lastname = lastname;
    }
}