import {Login} from "../../components/reminderContext/domain/entities/Login.js"

export abstract class LoginRepository {
    abstract getLoginById(id: string): Promise<Login | null>
    abstract addLogin(email: string, password: string, associatedUserIds: string[]): Promise<Login>
    abstract getLoginByEmail(email: string): Promise<Login | null>
    abstract deleteLogin(id: string): Promise<boolean>
}

