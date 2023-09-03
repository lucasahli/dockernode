import {Viewer} from "../../sharedKernel/Viewer.js";
import {Login} from "../../components/reminderContext/domain/entities/Login.js";

export interface AccountUseCase {
    signUp(viewer: Viewer, email: string, password: string): Promise<string | null>
    signIn(viewer: Viewer, email: string, password: string): Promise<string | null>
    deleteLogin(viewer: Viewer, id: string): Promise<boolean>
    getLoginByUser(viewer: Viewer, userId: string): Promise<Login>;
}