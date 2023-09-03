import {Viewer} from "../../sharedKernel/Viewer.js";
import {Login, User} from "../../components/reminderContext/domain/entities/index.js";

export interface AccountUseCase {
    signUp(viewer: Viewer, email: string, password: string): Promise<string | null>
    signIn(viewer: Viewer, email: string, password: string): Promise<string | null>
    deleteLogin(viewer: Viewer, id: string): Promise<boolean>
    getLoginByUser(viewer: Viewer, userId: string): Promise<Login>;
    getUsersByLogin(viewer: Viewer, loginId: string): Promise<(User | Error | null)[] | null>
}