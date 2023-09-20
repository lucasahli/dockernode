import {LoginService} from "./LoginService.js";
import {UserService} from "./UserService.js";
import {Viewer} from "../../../../sharedKernel/Viewer.js";
import {Login} from "../../domain/entities/Login.js";
import {User} from "../../domain/entities/User.js";
import {PasswordManager} from "../../domain/services/PasswordManager.js";
import jwt from 'jsonwebtoken';
import {Token} from "../../domain/valueObjects/Token.js";


export class AccountService {

    constructor(public loginService: LoginService,
                public userService: UserService,
                public passwordManager: PasswordManager) {
        this.loginService = loginService;
        this.userService = userService;
    }

    async signUp(viewer: Viewer, email: string, password: string, fullName: string): Promise<Token | null> {
        return this.loginService.createNewLogin(viewer, email, password)
            .then( (login) => {
                if(login) {
                    return this.userService.createFreemiumUser(login, fullName)
                        .then( (user: User) => {
                            const token = this.createToken(login, user, process.env.SECRET!, '30m');
                            let canSignUp = this.checkCanSignUp(viewer, email, password, token);
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
            .catch((error) => {
                console.log("Could not create new login --> Should return error: ", error);
                return null;
            });


    }

    private createToken(login: Login, user: User, secret: string, expiresIn: string): Token {
        const { id, email } = login;
        const { role } = user;
        return new Token(jwt.sign({loginId: id, loginEmail: email, userId: user.id, userRole: role}, secret, {expiresIn}));
    }

    private checkCanSignUp(viewer: Viewer, email: string, password: string, potentialToken: any): boolean {
        return !!potentialToken;
    }

    async signIn(viewer: Viewer, email: string, password: string): Promise<Token | null> {
        const login = await this.loginService.getLoginByEmail(email);
        if(login === null) return null;
        const canSignIn = await this.checkCanSignIn(viewer, email, password, login);
        const possibleUser = await this.userService.generate(viewer, login.associatedUserIds[0] ? login.associatedUserIds[0] : "");
        return canSignIn ? this.createToken(login, possibleUser as User, process.env.SECRET!, '30m') : null;
    }

    checkCanSignIn(viewer: Viewer, email: string, password: string, login: Login): Promise<boolean> {
        return this.passwordManager.checkIsCorrect(password, login.password);
    }

    async getLoginByUser(viewer: Viewer, userId: string): Promise<Login | null> {
        const user = await this.userService.generate(viewer, userId);
        if(user !== undefined){
            return this.loginService.generate(viewer, user!.associatedLoginId);
        }
        else {
            return null;
        }

    }

    async getUsersByLogin(viewer: Viewer, loginId: string): Promise<(User | Error | null)[] | null> {
        const login = await this.loginService.generate(viewer, loginId);
        return login ? this.userService.getMany(viewer, login.associatedUserIds) : null;
    }
}