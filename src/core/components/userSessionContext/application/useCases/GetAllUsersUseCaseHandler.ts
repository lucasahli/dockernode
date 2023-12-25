import {GetAllUsersUseCase} from "../../../../portsAndInterfaces/ports/index.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {UserService} from "../services/index.js";
import {User} from "../../domain/entities/index.js";

export class GetAllUsersUseCaseHandler implements GetAllUsersUseCase {
    constructor(private userService: UserService) {
    }

    execute(viewer: Viewer): Promise<(User | Error | null)[]> {
        return this.userService.getAllUsers(viewer);
    }
}