import {LoginRepository} from "../../../../portsAndInterfaces/interfaces/LoginRepository.js"
import {Login} from "../../domain/entities/Login.js";
import 'dotenv/config';
import {Viewer} from "../../../../sharedKernel/Viewer.js";
import {PasswordManager} from "../../domain/services/PasswordManager.js";
import {UserRepository} from "../../../../portsAndInterfaces/interfaces/UserRepository.js";
import {rejects} from "assert";
import {ValidationError} from "../../../../sharedKernel/index.js";
import {SignUpInvalidInputField, SignUpProblem} from "../../../../portsAndInterfaces/ports/SignUpUseCase.js";

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

    async createNewLogin(viewer: Viewer, email: string, password: string): Promise<Login | null | SignUpProblem> {
        // TODO: Create Clean login logic
        const existingLogin = await this.loginRepository.getLoginByEmail(email);
        if(existingLogin instanceof Login){
            return new SignUpProblem("SignUp Problem", [{
                field: SignUpInvalidInputField.EMAIL,
                message: "Email is already associated with a login"
            }]);
        }
        /* Once our server receives the username and password we will want to store it. However,
                        we will not want to store the password in plain text as if someone gains access to the
                         database they will have access to all the passwords! */

        /* To mitigate this we will use two concepts, salt and hashing. On the server we will generate
         and store a random string to use as our salt and add it to the password pre-hashing.
         This means that two of the same passwords will not generate the same hash. */
        return this.loginRepository.createLogin(email, await this.passwordManager.hashPassword(password), [], [], []);
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