import {UserUseCase} from "../../core/portsAndInterfaces/ports/userUseCase.js";
import {Viewer} from "../../core/sharedKernel/Viewer.js";
import {ReminderUseCase} from "../../core/portsAndInterfaces/ports/ReminderUseCase.js";
import {Reminder} from "../../core/components/reminderContext/domain/entities/Reminder.js";
import {UserService} from "../../core/components/reminderContext/domain/services/UserService.js";
import {PasswordManager} from "../../core/components/reminderContext/domain/services/PasswordManager.js";
import {BcryptHasher} from "../../infrastructure/security/BcryptHasher.js";
import {UserUseCaseHandler} from "../../core/components/reminderContext/useCases/UserUseCaseHandler.js";
import {ReminderService} from "../../core/components/reminderContext/domain/services/ReminderService.js";
import {ReminderUseCaseHandler} from "../../core/components/reminderContext/useCases/ReminderUseCaseHandler.js";
import {RedisRepository} from "../../infrastructure/persistence/redis/RedisRepository.js";
import {User} from "../../core/components/reminderContext/domain/entities/User.js";
import {LoginUseCase} from "../../core/portsAndInterfaces/ports/LoginUseCase.js";
import {LoginService} from "../../core/components/reminderContext/domain/services/LoginService.js";
import {LoginUseCaseHandler} from "../../core/components/reminderContext/useCases/LoginUseCaseHandler.js";
import {AccountUseCase} from "../../core/portsAndInterfaces/ports/AccountUseCase.js";
import {AccountUseCaseHandler} from "../../core/components/reminderContext/useCases/AccountUseCaseHandler.js";
import {AccountService} from "../../core/components/reminderContext/domain/services/AccountService.js";
import jwt from "jsonwebtoken";

class GraphQlApiPresenter {
    public userUseCase: UserUseCase;
    public reminderUseCase: ReminderUseCase;
    public loginUseCase: LoginUseCase;
    public accountUseCase: AccountUseCase;

    constructor(userUseCase: UserUseCase,
                reminderUseCase: ReminderUseCase,
                loginUseCase: LoginUseCase,
                accountUseCase: AccountUseCase) {
        this.userUseCase = userUseCase;
        this.reminderUseCase = reminderUseCase;
        this.loginUseCase = loginUseCase;
        this.accountUseCase = accountUseCase;
    }

    // Login
    public handleSignUpMutation(parent: any, args: any, viewer: Viewer): Promise<any | null> {
        return new Promise<any | null>( (resolve, reject) => {
            let {email, password} = args;
            let result = this.accountUseCase.signUp(viewer, email, password);
            result.then(function (tokenString) {
                if(tokenString == null){
                    return resolve(null);
                }
                return resolve({token: tokenString!});
            }).catch(function (reason) {
                return reject(reason);
            })
        });
    }

    public handleSignInMutation(parent: any, args: any, viewer: Viewer): Promise<any | null> {
        return new Promise<any | null>( (resolve, reject) => {
            let {email, password} = args;
            let result = this.accountUseCase.signIn(viewer, email, password);
            result.then(function (tokenString) {
                if(tokenString == null){
                    return resolve(null);
                }
                return resolve({token: tokenString!});
            }).catch(function (reason) {
                return reject(reason);
            })
        });
    }

    public handleLoginUsersFieldQuery(parent: any, args: any, viewer: Viewer): Promise<User[] | null> {
        return Promise.resolve(null);
    }

    // User
    public handleUserQuery(parent: any, args: any, viewer: Viewer): Promise<User | null> {
        let {id} = args;
        let result = this.userUseCase.getUserById(viewer, id);
        result.then(function (user) {
            return user;
        })
            .catch(function (error) {
                return error;
            })
        return result;
    }

    public handleUsersQuery(parent: any, args: any, viewer: Viewer): Promise<User[] | null> {
        return this.userUseCase.getAllUsers(viewer);
    }

    public handleDeleteUserMutation(parent: any, args: any, viewer: Viewer): Promise<boolean> {
        let {id} = args;
        return this.userUseCase.deleteUser(viewer, id);
    }

    // Reminder
    public handleReminderQuery(parent: any, args: any, viewer: Viewer): Promise<Reminder | null>{
        let {id} = args;
        let result = this.reminderUseCase.getReminderById(viewer, id);
        result.then(function (reminder) {
            return reminder;
        })
            .catch(function (error) {
                return error;
            })
        return result;
    }

    public handleUserRemindersFieldQuery(parent: any, args: any, viewer: Viewer): Promise<Reminder[] | null> {
        const user = parent;
        return this.reminderUseCase.getRemindersByUser(viewer, user.id);
        // return new Promise<Reminder[] | null>( () => null);
    }

    public handleCreateReminderMutation(parent: any, args: any, viewer: Viewer): Promise<Reminder | null> {
        let {title, date} = args;
        return this.reminderUseCase.createReminder(viewer, title, date);
    }

    public handleDeleteReminderMutation(parent: any, args: any, viewer: Viewer): Promise<boolean> {
        let {id} = args;
        return this.reminderUseCase.deleteReminderById(viewer, id);
    }
}

const redisRepository = new RedisRepository();
const userService = new UserService(redisRepository);
const loginService = new LoginService(redisRepository, new PasswordManager(new BcryptHasher()));
const userUseCase: UserUseCase = new UserUseCaseHandler(userService);
const loginUseCase: LoginUseCase = new LoginUseCaseHandler(loginService);
const reminderService = new ReminderService(redisRepository);
const reminderUseCase: ReminderUseCaseHandler = new ReminderUseCaseHandler(reminderService);
const accountService: AccountService = new AccountService(loginService, userService, new PasswordManager(new BcryptHasher()), jwt);
const accountUseCaseHandler: AccountUseCaseHandler = new AccountUseCaseHandler(accountService);
export const graphQlApiPresenter = new GraphQlApiPresenter(userUseCase, reminderUseCase, loginUseCase, accountUseCaseHandler);