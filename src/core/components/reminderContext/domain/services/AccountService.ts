import {LoginService} from "./LoginService.js";
import {UserService} from "./UserService.js";
import {Viewer} from "../../../../sharedKernel/Viewer.js";
import {Login} from "../entities/Login.js";
import {User} from "../entities/User.js";
import {PasswordManager} from "./PasswordManager.js";
import jwt from 'jsonwebtoken';


export class AccountService {

    constructor(public loginService: LoginService,
                public userService: UserService,
                public passwordManager: PasswordManager) {
        this.loginService = loginService;
        this.userService = userService;
    }

    async signUp(viewer: Viewer, email: string, password: string): Promise<string | null> {
        return this.loginService.createNewLogin(viewer, email, password)
            .then( function (login) {
                if(login) {
                    return UserService.createFreemiumUser(login, "Luca", "Sahli")
                        .then( (user: User) => {
                            const token = AccountService.createToken(login, user, process.env.SECRET!, '30m');
                            let canSignUp = AccountService.checkCanSignUp(viewer, email, password, token);
                            if(!canSignUp) {
                                console.log("Can not SignUp!!!");
                                return null;
                            }
                            return token;
                        })
                        .catch(() => {
                            console.log("Failed to create freemium user!!!");
                            return null;
                        });
                }
                console.log("Could not create login!!!");
                return null;
            })
            .catch(function (error) {
                console.log("Could not create new login --> Should return error: ", error);
                return null;
            });


    }

    static createToken(login: Login, user: User, secret: string, expiresIn: string): string {
        const { id, email } = login;
        const { role } = user;
        return jwt.sign({loginId: id, loginEmail: email, userId: user.id, userRole: role}, secret, {expiresIn});
    }

    static checkCanSignUp(viewer: Viewer, email: string, password: string, potentialToken: any): boolean {
        return !!potentialToken;
    }

    async signIn(viewer: Viewer, email: string, password: string): Promise<string | null> {
        const login = await this.loginService.getLoginByEmail(email);
        if(login === null) return null;
        const canSignIn = await this.checkCanSignIn(viewer, email, password, login);
        const possibleUser = await UserService.generate(viewer, login.associatedUserIds[0] ? login.associatedUserIds[0] : "");
        return canSignIn ? AccountService.createToken(login, possibleUser as User, process.env.SECRET!, '30m') : null;
    }

    public checkCanSignIn(viewer: Viewer, email: string, password: string, login: Login): Promise<boolean> {
        return this.passwordManager.checkIsCorrect(password, login.password);
    }
}