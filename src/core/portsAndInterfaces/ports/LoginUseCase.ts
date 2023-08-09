import {Viewer} from "../../sharedKernel/Viewer.js";
import {Login} from "../../components/reminderContext/domain/entities/Login.js";

export abstract class LoginUseCase {
    abstract getLoginById(viewer: Viewer, id: string): Promise<Login | null>
    abstract signUp(viewer: Viewer, email: string, password: string): Promise<string | null>
    abstract signIn(viewer: Viewer, email: string, password: string): Promise<string | null>
    abstract deleteLogin(viewer: Viewer, id: string): Promise<boolean>
}