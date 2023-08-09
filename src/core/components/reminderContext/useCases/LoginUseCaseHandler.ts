import {LoginUseCase} from "../../../portsAndInterfaces/ports/LoginUseCase.js";
import {Viewer} from "../../../sharedKernel/Viewer.js";
import {Login} from "../domain/entities/Login.js";
import {UserService} from "../domain/services/UserService.js";
import {LoginService} from "../domain/services/LoginService.js";

// TODO create Login use case
export class LoginUseCaseHandler implements LoginUseCase {
    private userService: UserService;
    private loginService: LoginService

    constructor(loginService: LoginService) {
        this.loginService = loginService;
    }

    deleteLogin(viewer: Viewer, id: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    getLoginById(viewer: Viewer, id: string): Promise<Login | null> {
        return Promise.resolve(null);
    }

    signIn(viewer: Viewer, email: string, password: string): Promise<string | null> {
        return this.loginService.signIn(viewer, email, password);
    }

    signUp(viewer: Viewer, email: string, password: string): Promise<string | null> {
        return this.loginService.signUp(viewer, email, password);
    }

}