import {Viewer} from "../../../../sharedKernel/index.js";
import {GetUsersByIdsUseCase} from "../../../../portsAndInterfaces/ports/GetUsersByIdsUseCase.js";
import {UserService} from "../services/index.js";
import {User} from "../../domain/entities/index.js";

export class GetUsersByIdsUseCaseHandler implements GetUsersByIdsUseCase {
    constructor(private userService: UserService) {
    }

    execute(viewer: Viewer, userIds: string[]): Promise<(User | Error | null)[]> {
        return this.userService.getMany(viewer, userIds);
    }
}