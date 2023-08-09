import {LoginRepository} from "../../../../portsAndInterfaces/interfaces/LoginRepository.js"
import {Login} from "../entities/Login.js";
import 'dotenv/config';
import {Viewer} from "../../../../sharedKernel/Viewer.js";
import {PasswordManager} from "./PasswordManager.js";
import {UserRepository} from "../../../../portsAndInterfaces/interfaces/UserRepository.js";
import {rejects} from "assert";

export class LoginService {
    private static loginRepository: LoginRepository;
    private static userRepository: UserRepository;
    private static passwordManager: PasswordManager;

    constructor(repo: LoginRepository, pwManager: PasswordManager) {
        LoginService.loginRepository = repo;
        LoginService.passwordManager = pwManager;
    }

    // Single source of truth for fetching
    static async generate(viewer: Viewer, id: string): Promise<Login | null> {
        const login = await this.loginRepository.getLoginById(id); // Nullable
        if(login === null) return null;
        const canSee = this.checkCanSee(viewer, login);
        return canSee ? login : null;
    }

    async createNewLogin(viewer: Viewer, email: string, password: string): Promise<Login | null> {
        return new Promise<Login | null> ((resolve, reject) => {
            return LoginService.loginRepository.getLoginByEmail(email)
                .then(async existingLogin => {
                    if (existingLogin) {
                        return reject("Login with that email already exists!!!");
                    } else {
                        return LoginService.loginRepository.addLogin(email, await LoginService.passwordManager.hashPassword(password), [])
                            .then(addedLogin => {
                                return resolve(addedLogin);
                            })
                            .catch(reason => {
                                return resolve(null);
                            });
                    }
                })
                .catch(async () => {
                    return LoginService.loginRepository.addLogin(email, await LoginService.passwordManager.hashPassword(password), [])
                        .then(addedLogin => {
                            return resolve(addedLogin);
                        })
                        .catch(reason => {
                            return resolve(null);
                        });
                });
        });
    }

    async getLoginByEmail(email: string): Promise<Login | null> {
        return LoginService.loginRepository.getLoginByEmail(email);
    }

    static async deleteLogin(viewer: Viewer, id: string): Promise<boolean> {
        const loginToDelete = await this.loginRepository.getLoginById(id)
            .then((result) => {
                return result;
            }).catch((reason) => {
                if(reason.message == "Cannot read property 'id' of null") {
                    console.log("Can not find user with this id...")
                }
                return null;
            });
        if(loginToDelete === null) return false;
        const canDelete = this.checkCanDelete(viewer, loginToDelete);
        return canDelete ? LoginService.loginRepository.deleteLogin(id) : false;
    }

    private static checkCanSee(viewer: Viewer, user: Login): boolean {
        return viewer.hasValidToken() && viewer.getPayloadFromToken() != user.id;
    }

    private static checkCanDelete(viewer: Viewer, user: Login): boolean {
        return true;
    }
}