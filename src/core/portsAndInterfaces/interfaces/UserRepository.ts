import {User} from "../../components/reminderContext/domain/entities/User.js";
import {Login} from "../../components/reminderContext/domain/entities/Login.js";
import {UserRole} from "../../sharedKernel/UserRole.js";

export interface UserRepository {
    getAllUserIds(): Promise<string[] | null>
    getUserById(id: string): Promise<User | null>

    getManyUsersByIds(ids: string[]): Promise<(User | Error | null)[]>
    addUser(associatedLoginId: string, role: UserRole, firstname: string, lastname: string): Promise<User>
    deleteUser(id: string): Promise<boolean>
}

