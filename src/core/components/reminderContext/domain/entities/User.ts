import {Login} from "./Login.js";
import {Reminder} from "./Reminder.js";
import {UserRole} from "../../../../sharedKernel/UserRole.js";

export class User {
    id: string;
    associatedLoginId: string;
    role: UserRole;
    fullName: string;

    constructor(id: string, associatedLoginId: string, role: UserRole, fullName: string) {
        this.id = id;
        this.associatedLoginId = associatedLoginId;
        this.role = role;
        this.fullName = fullName;
    }
}