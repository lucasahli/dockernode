import jwt from 'jsonwebtoken';
import {Login, User, Device} from "../../domain/entities/index.js";
import {Email, FullName, AccessToken, SessionStatus, Password} from "../../domain/valueObjects/index.js";
import {PasswordManager} from "../../domain/services/index.js";
import {LoginService, UserService, DeviceService, SessionService, RefreshTokenService} from "./index.js";
import {Viewer, DatabaseError} from "../../../../sharedKernel/index.js";
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
                public passwordManager: PasswordManager,
                public deviceService: DeviceService,
                public sessionService: SessionService,
                public refreshTokenService: RefreshTokenService) {}

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
            const deviceInfo = viewer.createDeviceInfoFromHeaders();
            if(deviceInfo === undefined) {
                throw new DatabaseError("Could not create new Device Info");
            }
            const currentDateTime = new Date(Date.now());
            var device: Device | undefined = undefined;
            const knownDevice = await this.deviceService.getDeviceByDeviceIdentifier(viewer, deviceInfo.deviceIdentifier);
            if(knownDevice) {
                device = knownDevice;
            }
            else {
                const newDevice = await this.deviceService.createDevice(
                    viewer,
                    deviceInfo.deviceIdentifier,
                    deviceInfo.userAgentString,
                    deviceInfo.deviceType,
                    deviceInfo.deviceName,
                    deviceInfo.deviceOperatingSystem,
                    currentDateTime,
                    []
                );
                if(!newDevice){
                    throw new DatabaseError("Could not create new Device");
                }
                device = newDevice;
            }

            const expirationDateTime = new Date(currentDateTime);
            expirationDateTime.setDate(currentDateTime.getDate() + 90);
            const refreshToken = await this.refreshTokenService.createRefreshToken(
                viewer,
                this.createRefreshTokenString(),
                expirationDateTime,
                false,
                newLogin.id,
                device.id
                );
            if(!refreshToken){
                throw new DatabaseError("Could not create new RefreshToken")
            }
            const newSession = await this.sessionService.createSession(
                viewer,
                new Date(Date.now()),
                SessionStatus.active,
                undefined,
                device.id,
                newLogin.id,
                refreshToken.id
            );
            if(!newSession){
                throw new DatabaseError("Could not create new Session");
            }
            return {
                sessionId: newSession.id,
                accessToken: this.createAccessToken(newLogin, newUser, process.env.SECRET!, '30m'),
                refreshToken: refreshToken
            };
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

    private createAccessToken(login: Login, user: User, secret: string, expiresIn: string): AccessToken {
        const { id, email } = login;
        const { role } = user;
        return new AccessToken(jwt.sign({loginId: id, loginEmail: email, userId: user.id, userRole: role}, secret, {expiresIn}));
    }

    private checkCanSignUp(viewer: Viewer, email: string, password: string, fullName: string): boolean {
        const isValidEmail = Email.isValid(email);
        const isValidPassword = Password.isValid(password);
        const isValidFullName = FullName.isValid(fullName);
        return (isValidEmail && isValidPassword && isValidFullName);
    }

    async signIn(viewer: Viewer, email: string, password: string): Promise<SignInResult> {
        // TODO: Check this function very carefully
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
        const deviceInfo = viewer.createDeviceInfoFromHeaders();
        if(deviceInfo === undefined) {
            throw new DatabaseError("Could not create new Device Info");
        }
        let device: Device;
        const knownDevice = await this.deviceService.getDeviceByDeviceIdentifier(viewer, deviceInfo.deviceIdentifier);
        const currentDateTime = new Date(Date.now());
        if(!knownDevice){
            const newDevice = await this.deviceService.createDevice(
                viewer,
                deviceInfo.deviceIdentifier,
                deviceInfo.userAgentString,
                deviceInfo.deviceType,
                deviceInfo.deviceName,
                deviceInfo.deviceOperatingSystem,
                currentDateTime,
                []
            );
            if(!newDevice){
                throw new DatabaseError("Could not create new Device");
            }
            device = newDevice;
        }
        else {
            device = knownDevice;
        }
        const expirationDateTime = new Date();
        expirationDateTime.setDate(currentDateTime.getDate() + 90);
        const refreshToken = await this.refreshTokenService.createRefreshToken(
            viewer,
            this.createRefreshTokenString(),
            new Date(expirationDateTime),
            false,
            login.id,
            device.id
        );
        if(!refreshToken){
            throw new DatabaseError("Could not create new RefreshToken")
        }
        const newSession = await this.sessionService.createSession(
            viewer,
            new Date(Date.now()),
            SessionStatus.active,
            undefined,
            device.id,
            login.id,
            refreshToken.id
        );
        if(!newSession){
            throw new DatabaseError("Could not create new Session");
        }
        return {
            sessionId: newSession.id,
            accessToken: this.createAccessToken(login, possibleUser, process.env.SECRET!, '30m'),
            refreshToken: refreshToken
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

    private createRefreshTokenString() {
        return jwt.sign({tokenPayload: "TokenPayload"}, process.env.SECRET!, {expiresIn: '90d'});
    }
}