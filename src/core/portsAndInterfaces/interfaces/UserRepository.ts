import {User} from "../../components/reminderContext/domain/entities/User.js";
import {UserRole} from "../../sharedKernel/UserRole.js";

export interface UserRepository {
    getAllUserIds(): Promise<string[] | null>
    getUserById(id: string): Promise<User | null>

    getManyUsersByIds(ids: string[]): Promise<(User | Error | null)[]>
    createUser(associatedLoginId: string, role: UserRole, fullName: string): Promise<User>
    deleteUser(id: string): Promise<boolean>
}

