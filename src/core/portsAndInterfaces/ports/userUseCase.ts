// expose functionality of the user component

import {Login} from "../../components/reminderContext/domain/entities/Login.js";
import {Viewer} from "../../sharedKernel/Viewer.js";
import {User} from "../../components/reminderContext/domain/entities/User.js";

export abstract class UserUseCase {
    abstract getUserById(viewer: Viewer, id: string): Promise<User | null>
    abstract signUpNewUser(viewer: Viewer, email: string, password: string): Promise<string | null>
    abstract getAllUsers(viewer: Viewer): Promise<User[] | null>
    abstract signInUser(viewer: Viewer, email: string, password: string): Promise<string | null>
    abstract deleteUser(viewer: Viewer, id: string): Promise<boolean>
}