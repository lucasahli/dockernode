// expose functionality of the user component

import {Viewer} from "../../sharedKernel/Viewer.js";
import {User} from "../../components/reminderContext/domain/entities/index.js";

export interface UserUseCase {
    getUserById(viewer: Viewer, id: string): Promise<User | null>
    getAllUsers(viewer: Viewer): Promise<(User | Error | null)[]>
    deleteUser(viewer: Viewer, id: string): Promise<boolean>
}