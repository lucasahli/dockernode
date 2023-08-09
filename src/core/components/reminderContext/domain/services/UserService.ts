import 'dotenv/config';
import {Viewer} from "../../../../sharedKernel/Viewer.js";
import {UserRepository} from "../../../../portsAndInterfaces/interfaces/UserRepository.js";
import {User} from "../entities/User.js";
import {Login} from "../entities/Login.js";
import {UserRole} from "../../../../sharedKernel/UserRole.js";

export class UserService {
    private static userRepository: UserRepository;

    constructor(repo: UserRepository) {
        UserService.userRepository = repo;
    }

    // Single source of truth for fetching
    static async generate(viewer: Viewer, id: string): Promise<User | null> {
        const user = await this.userRepository.getUserById(id); // Nullable
        if(user === null) return null;
        const canSee = this.checkCanSee(viewer, user);
        return canSee ? user : null;
    }

    static async createFreemiumUser(login: Login, firstname: string, lastname: string): Promise<User> {
        return UserService.userRepository.addUser(login, UserRole.freemium, firstname, lastname);
    }

    static async deleteUser(viewer: Viewer, id: string): Promise<boolean> {
        const dataOfUserToDelete = await this.userRepository.getUserById(id)
            .then((result) => {
                return result;
            }).catch((reason) => {
                if(reason.message == "Cannot read property 'id' of null") {
                    console.log("Can not find user with this id...")
                }
                return null;
            });
        if(dataOfUserToDelete === null) return false;
        const canDelete = this.checkCanDelete(viewer, dataOfUserToDelete);
        return canDelete ? UserService.userRepository.deleteUser(id) : false;
    }

    // async getAllUsers(viewer: Viewer): Promise<Login[] | null> {
    //     return this.getAllUserIds()
    //         .then(function (userIds) {
    //             return userIds.filter(async (userId) => {
    //                 const possibleUser = await UserService.generate(viewer, userId)
    //                     .then(function (user) {
    //                         return user;
    //                     })
    //                     .catch(function (reason) {
    //                         console.log("Could not generate user: ", reason);
    //                         return null;
    //                     });
    //                 if (possibleUser !== null) {
    //                     return true;
    //                 }
    //             }).map(async (userId) => {
    //                 return await UserService.generate(viewer, userId);
    //             }) as unknown as Login[];
    //         })
    //         .catch(reason => {
    //             console.log("Problem with ids!!!", reason)
    //             return null;
    //         })
    // }


    private static checkCanSee(viewer: Viewer, user: User): boolean {
        return true;
    }

    private static checkCanDelete(viewer: Viewer, user: User): boolean {
        console.log(viewer);
        return true;
    }
}