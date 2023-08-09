import {User} from "../../components/reminderContext/domain/entities/User.js"
import {Login} from "../../components/reminderContext/domain/entities/Login.js";
import {UserRole} from "../../sharedKernel/UserRole.js";

export abstract class UserRepository {
    abstract getUserById(id: string): Promise<User | null>
    abstract addUser(login: Login, role: UserRole, firstname: string, lastname: string): Promise<User>
    abstract deleteUser(id: string): Promise<boolean>
}

