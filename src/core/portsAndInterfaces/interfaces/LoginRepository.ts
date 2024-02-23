import {Login} from "../../components/userSessionContext/domain/entities/Login.js"

export interface LoginRepository {
     getLoginById(id: string): Promise<Login | null>
     createLogin(email: string, password: string, associatedUserIds: string[], associatedDeviceIds: string[], associatedSessionIds: string[]): Promise<Login>
     getLoginByEmail(email: string): Promise<Login | null>
     getLoginIdBySessionId(sessionId: string): Promise<string | null>
     updateLogin(updatedLogin: Login): Promise<boolean>
     deleteLogin(id: string): Promise<boolean>
}

