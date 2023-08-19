import 'dotenv/config';
import {Viewer} from "../../../../sharedKernel/Viewer.js";
import {UserRepository} from "../../../../portsAndInterfaces/interfaces/UserRepository.js";
import {User} from "../entities/User.js";
import {Login} from "../entities/Login.js";
import {UserRole} from "../../../../sharedKernel/UserRole.js";

export class UserService {
    private userRepository: UserRepository;

    constructor(repo: UserRepository) {
        this.userRepository = repo;
    }

    // Single source of truth for fetching
    async generate(viewer: Viewer, id: string): Promise<User | null> {
        const user = await this.userRepository.getUserById(id); // Nullable
        if(user === null) return null;
        const canSee = this.checkCanSee(viewer, user);
        return canSee ? user : null;
    }

    async createFreemiumUser(login: Login, firstname: string, lastname: string): Promise<User> {
        if (await this.checkCanCreateFreemiumUser(login)) {
            return this.userRepository.addUser(login.id, UserRole.freemium, firstname, lastname);
        }
        return Promise.reject("This login is already associated with a user with that role!!!");
    }

    async deleteUser(viewer: Viewer, id: string): Promise<boolean> {
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
        return canDelete ? this.userRepository.deleteUser(id) : false;
    }

    private async checkCanCreateFreemiumUser(login: Login): Promise<boolean> {
            const promises = [];
            for (const userId of login.associatedUserIds) {
                promises.push(this.userRepository.getUserById(userId));
            }
            if (login.associatedUserIds.length >= 1) {
                return await Promise.all(promises)
                    .then((results) => {
                        for (const user of results) {
                            if (user?.role === UserRole.freemium) {
                                return false;
                            }
                        }
                        return true;
                    })
                    .catch((e) => {
                        return true;
                        // Handle errors here
                    });
            }
            else {
                return true;
            }

    }

    private checkCanSee(viewer: Viewer, user: User): boolean {
        return true;
    }

    private checkCanDelete(viewer: Viewer, user: User): boolean {
        return true;
    }
}