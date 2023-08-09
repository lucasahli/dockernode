import {UserUseCase} from "../../../portsAndInterfaces/ports/userUseCase.js"
import {UserService} from "../domain/services/UserService.js"
import {Login} from "../domain/entities/Login.js";
import {Viewer} from "../../../sharedKernel/Viewer.js";
import {User} from "../domain/entities/User.js";
import {Reminder} from "../domain/entities/Reminder.js";

// TODO create Login use case
export class UserUseCaseHandler extends UserUseCase {
    private userService: UserService;

    constructor(service: UserService) {
        super();
        this.userService = service;
    }

    getUserById(viewer: Viewer, id: string): Promise<User | null> {
        return UserService.generate(viewer, id);
    }

    signUpNewUser(viewer: Viewer, email: string, password: string): Promise<string | null> {
        // return this.userService.signUpNewUser(viewer, email, password);
        return new Promise<string | null>( () => null);
    }

    getAllUsers(viewer: Viewer): Promise<User[] | null> {
        return this.userService.getAllUsers(viewer);
    }

    signInUser(viewer: Viewer, email: string, password: string): Promise<string | null> {
        // return UserService.signInUser(viewer, email, password);
        return new Promise<string | null>( () => null);
    }

    deleteUser(viewer: Viewer, id: string): Promise<boolean> {
        return UserService.deleteUser(viewer, id);
    }

}