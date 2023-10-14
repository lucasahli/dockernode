import {LoginService} from "./LoginService.js";
import {UserService} from "./UserService.js";
import {Viewer} from "../../../../sharedKernel/Viewer.js";
import {Login} from "../../domain/entities/Login.js";
import {User} from "../../domain/entities/User.js";
import {PasswordManager} from "../../domain/services/index.js";
import jwt from 'jsonwebtoken';
import {Token} from "../../domain/valueObjects/Token.js";
import {ValidationError} from "../../../../sharedKernel/index.js";
import {Email, FullName} from "../../domain/valueObjects/index.js";
import {Password} from "../../domain/valueObjects/Password.js";
import {DatabaseError} from "../../../../sharedKernel/errors/DatabaseError.js";
import {
    SignUpInvalidInput,
    SignUpInvalidInputField,
    SignUpProblem,
    SignUpResult
} from "../../../../portsAndInterfaces/ports/SignUpUseCase.js";
import {
    SignInInvalidInputField,
    SignInProblem,
    SignInResult
} from "../../../../portsAndInterfaces/ports/SignInUseCase.js";


export class AccountService {

    constructor(public loginService: LoginService,
                public userService: UserService,
                public passwordManager: PasswordManager) {}

    async signUp(viewer: Viewer, email: string, password: string, fullName: string): Promise<SignUpResult> {
        const canSignUp = this.checkCanSignUp(viewer, email, password, fullName);
        if(canSignUp){
            const newLogin = await this.loginService.createNewLogin(viewer, email, password);
            if(newLogin instanceof SignUpProblem){
                return newLogin as SignUpProblem;
            }
            if(newLogin === null){
                throw new DatabaseError("Could not create new login");
            }
            const newUser = await this.userService.createFreemiumUser(newLogin, fullName);
            if(newUser === null){
                throw new DatabaseError("Could not create new FreemiumUser");
            }
            return {token: this.createToken(newLogin, newUser, process.env.SECRET!, '30m')};
        }
        const invalidInputs: SignUpInvalidInput[] = [];
        if(!Email.isValid(email)){
            invalidInputs.push({
                field: SignUpInvalidInputField.EMAIL,
                message: "Email is invalid",
            });
        }
        if(!Password.isValid(password)){
            invalidInputs.push({
                field: SignUpInvalidInputField.PASSWORD,
                message: "Password is invalid: Needs to have at least 8 characters",
            });
        }
        if(!FullName.isValid(fullName)){
            invalidInputs.push({
                field: SignUpInvalidInputField.FULL_NAME,
                message: "Full name is invalid: Needs to be longer",
            });
        }
        return {title: "SignUp Problem", invalidInputs: invalidInputs};
    }

    private createToken(login: Login, user: User, secret: string, expiresIn: string): Token {
        const { id, email } = login;
        const { role } = user;
        return new Token(jwt.sign({loginId: id, loginEmail: email, userId: user.id, userRole: role}, secret, {expiresIn}));
    }

    private checkCanSignUp(viewer: Viewer, email: string, password: string, fullName: string): boolean {
        const isValidEmail = Email.isValid(email);
        const isValidPassword = Password.isValid(password);
        const isValidFullName = FullName.isValid(fullName);
        return (isValidEmail && isValidPassword && isValidFullName);
    }

    async signIn(viewer: Viewer, email: string, password: string): Promise<SignInResult> {
        const login = await this.loginService.getLoginByEmail(email);

        if(login === null) {
            return new SignInProblem("SignIn Problem", [{
                field: SignInInvalidInputField.EMAIL,
                message: "Email is not associated with a login"
            }]);
        }

        const canSignIn = await this.checkCanSignIn(viewer, email, password, login);
        if(!canSignIn) return new SignInProblem("SignIn Problem", [{
            field: SignInInvalidInputField.PASSWORD,
            message: "Wrong Password"
        }]);

        const possibleUser = await this.userService.generate(viewer, login.associatedUserIds[0] ? login.associatedUserIds[0] : "");
        if(possibleUser === null) throw new DatabaseError("No user associated with login");
        return {
            token: this.createToken(login, possibleUser, process.env.SECRET!, '30m'),
        };
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