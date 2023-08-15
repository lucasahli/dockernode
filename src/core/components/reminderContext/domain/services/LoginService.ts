import {LoginRepository} from "../../../../portsAndInterfaces/interfaces/LoginRepository.js"
import {Login} from "../entities/Login.js";
import 'dotenv/config';
import {Viewer} from "../../../../sharedKernel/Viewer.js";
import {PasswordManager} from "./PasswordManager.js";
import {UserRepository} from "../../../../portsAndInterfaces/interfaces/UserRepository.js";
import {rejects} from "assert";

export class LoginService {
    private loginRepository: LoginRepository;
    private passwordManager: PasswordManager;

    constructor(repo: LoginRepository, pwManager: PasswordManager) {
        this.loginRepository = repo;
        this.passwordManager = pwManager;
    }

    // Single source of truth for fetching
    async generate(viewer: Viewer, id: string): Promise<Login | null> {
        const login = await this.loginRepository.getLoginById(id); // Nullable
        if(login === null) return null;
        const canSee = this.checkCanSee(viewer, login);
        return canSee ? login : null;
    }

    async createNewLogin(viewer: Viewer, email: string, password: string): Promise<Login | null> {
        return new Promise<Login | null> ((resolve, reject) => {
            return this.loginRepository.getLoginByEmail(email)
                .then(async existingLogin => {
                    if (existingLogin) {
                        return reject("Login with that email already exists!!!");
                    } else {
                        return this.loginRepository.addLogin(email, await this.passwordManager.hashPassword(password), [])
                            .then(addedLogin => {
                                return resolve(addedLogin);
                            })
                            .catch(reason => {
                                return resolve(null);
                            });
                    }
                })
                .catch(async () => {
                    return this.loginRepository.addLogin(email, await this.passwordManager.hashPassword(password), [])
                        .then(addedLogin => {
                            return resolve(addedLogin);
                        })
                        .catch(reason => {
                            return resolve(null);
                        });
                });
        });
    }

    // TODO: Probably add viewer to parameters
    async getLoginByEmail(email: string): Promise<Login | null> {
        return this.loginRepository.getLoginByEmail(email);
    }

    async deleteLogin(viewer: Viewer, id: string): Promise<boolean> {
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
        return canDelete ? this.loginRepository.deleteLogin(id) : false;
    }

    private checkCanSee(viewer: Viewer, login: Login): boolean {
        return true;
    }

    private checkCanDelete(viewer: Viewer, login: Login): boolean {
        return true;
    }
}