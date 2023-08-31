import {UserUseCase} from "../../../portsAndInterfaces/ports/UserUseCase.js"
import {UserService} from "../domain/services/index.js"
import {Viewer} from "../../../sharedKernel/index.js";
import {User} from "../domain/entities/index.js";

// TODO create Login use case
export class UserUseCaseHandler implements UserUseCase {

    constructor(private userService: UserService) {
    }

    getUserById(viewer: Viewer, id: string): Promise<User | null> {
        return this.userService.generate(viewer, id);
    }

    getAllUsers(viewer: Viewer): Promise<(User | Error | null)[]> {
        return this.userService.getAllUsers(viewer);
    }

    deleteUser(viewer: Viewer, id: string): Promise<boolean> {
        return this.userService.deleteUser(viewer, id);
    }

}