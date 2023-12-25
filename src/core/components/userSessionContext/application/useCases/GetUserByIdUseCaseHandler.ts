import {GetUserByIdUseCase} from "../../../../portsAndInterfaces/ports/GetUserByIdUseCase.js";
import {Viewer} from "../../../../sharedKernel/index.js";
import {UserService} from "../services/index.js";
import {User} from "../../domain/entities/index.js";

export class GetUserByIdUseCaseHandler implements GetUserByIdUseCase {
    constructor(private userService: UserService) {
    }

    execute(viewer: Viewer, id: string): Promise<User | null> {
        return this.userService.generate(viewer, id);
    }

}