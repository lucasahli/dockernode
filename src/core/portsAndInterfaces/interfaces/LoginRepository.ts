import {Login} from "../../components/reminderContext/domain/entities/Login.js"

export interface LoginRepository {
     getLoginById(id: string): Promise<Login | null>
     createLogin(email: string, password: string, associatedUserIds: string[]): Promise<Login>
     getLoginByEmail(email: string): Promise<Login | null>
     deleteLogin(id: string): Promise<boolean>
}

