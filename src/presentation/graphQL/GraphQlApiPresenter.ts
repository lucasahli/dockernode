import { Viewer } from "../../core/sharedKernel/Viewer.js";
import { Reminder } from "../../core/components/reminderContext/domain/entities/Reminder.js";
import { UserService, ReminderService, LoginService, AccountService } from "../../core/components/reminderContext/application/services/index.js";
import { PasswordManager } from "../../core/components/reminderContext/domain/services/index.js";
import { BcryptHasher } from "../../infrastructure/security/BcryptHasher.js";
import { RedisRepository } from "../../infrastructure/persistence/redis/RedisRepository.js";
import { User } from "../../core/components/reminderContext/domain/entities/User.js";
import jwt from "jsonwebtoken";
import {Login} from "../../core/components/reminderContext/domain/entities/index.js";

class GraphQlApiPresenter {

  constructor() {
  }

  //
  // Login
  //
  public handleSignUpMutation(
    parent: any,
    args: any,
    viewer: Viewer
  ): Promise<any | null> {
    return new Promise<any | null>((resolve, reject) => {
      let { email, password } = args;
      let result = this.accountUseCase.signUp(viewer, email, password);
      result
        .then((tokenString) => {
          if (tokenString == null) {
            return resolve(null);
          }
          return resolve({ token: tokenString! });
        })
        .catch((reason) => {
          return reject(reason);
        });
    });
  }

  public handleSignInMutation(
    parent: any,
    args: any,
    viewer: Viewer
  ): Promise<any | null> {
    return new Promise<any | null>((resolve, reject) => {
      let { email, password } = args;
      let result = this.accountUseCase.signIn(viewer, email, password);
      result
        .then((tokenString) => {
          if (tokenString == null) {
            return resolve(null);
          }
          return resolve({ token: tokenString! });
        })
        .catch((reason) => {
          return reject(reason);
        });
    });
  }

  public handleLoginUsersFieldQuery(
    parent: any,
    args: any,
    viewer: Viewer
  ): Promise<(User | Error | null)[] | null> {
    const login = parent;
    return this.accountUseCase.getUsersByLogin(viewer, login.id);
  }

  //
  // User
  //
  public handleUserQuery(
    parent: any,
    args: any,
    viewer: Viewer
  ): Promise<User | null> {
    let { id } = args;
    return this.userUseCase.getUserById(viewer, id);
    // let result = this.userUseCase.getUserById(viewer, id);
    // result
    //   .then((user) => {
    //     return user;
    //   })
    //   .catch((error) => {
    //     return error;
    //   });
    // return result;
  }

  public handleUsersQuery(
    parent: any,
    args: any,
    viewer: Viewer
  ): Promise<(User | Error | null)[]> {
    return this.userUseCase.getAllUsers(viewer);
  }

  public handleDeleteUserMutation(
    parent: any,
    args: any,
    viewer: Viewer
  ): Promise<boolean> {
    let { id } = args;
    return this.userUseCase.deleteUser(viewer, id);
  }

  public handleUserLoginFieldQuery(parent: any, args: any, viewer: Viewer): Promise<Login> {
    const user = parent;
    return this.accountUseCase.getLoginByUser(viewer, user.id);
  }

  //
  // Reminder
  //
  public handleReminderQuery(
    parent: any,
    args: any,
    viewer: Viewer
  ): Promise<Reminder | null> {
    let { id } = args;
    let result = this.reminderUseCase.getReminderById(viewer, id);
    result
      .then((reminder) => {
        return reminder;
      })
      .catch((error) => {
        return error;
      });
    return result;
  }

  public handleUserRemindersFieldQuery(
    parent: any,
    args: any,
    viewer: Viewer
  ): Promise<(Reminder | Error | null)[]> {
    const user = parent;
    return this.reminderUseCase.getRemindersByUser(viewer, user.id);
  }

  public handleCreateReminderMutation(
    parent: any,
    args: any,
    viewer: Viewer
  ): Promise<Reminder | null> {
    let { title, dateTimeToRemind } = args;
    return this.reminderUseCase.createReminder(viewer, title, dateTimeToRemind);
  }

  public handleDeleteReminderMutation(
    parent: any,
    args: any,
    viewer: Viewer
  ): Promise<boolean> {
    let { id } = args;
    return this.reminderUseCase.deleteReminderById(viewer, id);
  }

  handleRemindersQuery(parent: any, args: any, viewer: Viewer): Promise<(Reminder | Error | null)[]> {
    return this.reminderUseCase.getAllReminders(viewer);
  }

  handleReminderOwnerQuery(parent: any, args: any, viewer: Viewer) {
    const reminder = parent;
    return this.userUseCase.getUserById(viewer, reminder.ownerId);
  }
}


//
// Prepare the Class
//
const redisRepository = new RedisRepository(
  `${process.env.REDIS_HOST}`,
  `${process.env.REDIS_PORT}`
);
const userService = new UserService(redisRepository);
const loginService = new LoginService(
  redisRepository,
  new PasswordManager(new BcryptHasher())
);
const reminderService = new ReminderService(redisRepository);

const accountService: AccountService = new AccountService(
  loginService,
  userService,
  new PasswordManager(new BcryptHasher())
);

export const graphQlApiPresenter = new GraphQlApiPresenter();
