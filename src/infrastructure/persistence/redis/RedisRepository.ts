import { createClient, RedisClientType } from "redis";
import { LoginRepository } from "../../../core/portsAndInterfaces/interfaces/LoginRepository.js";
import { UserRepository } from "../../../core/portsAndInterfaces/interfaces/UserRepository.js";
import { ReminderRepository } from "../../../core/portsAndInterfaces/interfaces/ReminderRepository.js";
import { Login } from "../../../core/components/reminderContext/domain/entities/Login.js";
import { Reminder } from "../../../core/components/reminderContext/domain/entities/Reminder.js";
import { User } from "../../../core/components/reminderContext/domain/entities/User.js";
import { rejects } from "assert";
import { UserRole } from "../../../core/sharedKernel/UserRole.js";
// import DataLoader from "dataloader";

function generateRandomStringWithLength(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// implements LoginRepository, UserRepository, ReminderRepository
export class RedisRepository
  implements LoginRepository, UserRepository, ReminderRepository
{
  redis: RedisClientType;

  constructor(redisHost: string | null, redisPort: string | null) {
    const redisUrl =
      `redis://${redisHost}:${redisPort}` || "redis://localhost:6379";
    console.log("Redis URL: ", redisUrl);
    this.redis = createClient({ url: redisUrl });
    this.redis.on("error", (err) => console.log("Redis Client Error", err));
    this.redis.connect().then(() => console.log("Redis connected"));

    // @ts-ignore
    // const redisLoader = new DataLoader<string, User>(
    //     (keys: string[]) => {
    //         return new Promise<(User | Error)[]>((resolve, reject) => {
    //             this.redis.mGet(keys)
    //                 .then(results => {
    //                     resolve(results.map((result, index) => {
    //                             if (result) {
    //                                 const userData = JSON.parse(result);
    //                                 return new User(userData.id, null, userData.role as UserRole, userData.firstname, userData.lastname);
    //                             }
    //                             else {
    //                                 return new Error(`No key: ${keys[index]}`);
    //                             }
    //                     }));
    //                 })
    //                 .catch(reason => reject(reason));
    //
    //         })
    //     });
  }

  async connect() {
    await this.redis.connect();
  }

  async doSomething() {
    await this.redis.set("key", "value");
    const value = await this.redis.get("key");
    await this.redis.disconnect();
  }

  async addLogin(
    email: string,
    password: string,
    associatedUserIds: string[]
  ): Promise<Login> {
    if (await this.redis.hGet("logins", email)) {
      return Promise.reject("Login with that email already exists!");
    }
    const loginId = await this.redis.incr("next_login_id");
    const authsecret = generateRandomStringWithLength(16);
    await this.redis.hSet("logins", email, loginId);
    await this.redis.hSet("login:" + loginId.toString(), [
      ...Object.entries({
        email: email,
        password: password,
        auth: authsecret,
      }).flat(),
    ]);
    await this.redis.hSet("auths", authsecret, loginId);
    if (associatedUserIds.length > 0) {
      await this.redis.sAdd(
        "login:" + loginId.toString() + "associated_user_ids",
        associatedUserIds
      );
    }
    // const now = new Date();
    // await this.redis.zAdd("logins_by_time", {score: now.getMilliseconds(), value: email});
    return Promise.resolve(
      new Login(loginId.toString(), email, password, associatedUserIds)
    );
  }

  async addReminder(
    title: string,
    date: Date,
    ownerId: string
  ): Promise<Reminder> {
    const reminderId = await this.redis.incr("next_reminder_id");
    console.log("DATE: ", date);
    await this.redis.hSet("reminder:" + reminderId.toString(), [
      ...Object.entries({
        title: title,
        date: date.toISOString(),
        ownerId: ownerId,
      }).flat(),
    ]);
    await this.redis.sAdd(
      "user:" + ownerId + "reminders",
      reminderId.toString()
    );
    return Promise.resolve(
      new Reminder(reminderId.toString(), title, date, ownerId)
    );
  }

  async addUser(
    login: Login,
    role: UserRole,
    firstname: string,
    lastname: string
  ): Promise<User> {
    // Get users already associated with this login:
    for (const userId of login.associatedUserIds) {
      const user = await this.getUserById(userId);
      if (user !== null) {
        if (user.role === role) {
          return Promise.reject(
            "This login is already associated with a user with that role!!!"
          );
        }
      }
    }
    // Add new user
    const userId = await this.redis.incr("next_user_id");
    await this.redis.hSet("user:" + userId.toString(), [
      ...Object.entries({
        login: login.id,
        role: role,
        firstname: firstname,
        lastname: lastname,
      }).flat(),
    ]);
    await this.redis.sAdd(
      "login:" + login.id + "associated_user_ids",
      userId.toString()
    );
    return Promise.resolve(
      new User(userId.toString(), login, role, firstname, lastname)
    );
  }

  async deleteLogin(id: string): Promise<boolean> {
    const loginData = await this.redis.hGetAll("login:" + id);
    if (!loginData) {
      return Promise.reject("No login found with id: " + id);
    }
    // await this.redis.hSet("logins", email, loginId);
    await this.redis.hDel("logins", loginData.email);
    // await this.redis.hSet("auths", authsecret, loginId);
    await this.redis.hDel("auths", loginData.auth);
    // await this.redis.sAdd("login:" + loginId.toString() + "associated_user_ids", associatedUserIds);
    const associatedUserIds = await this.redis.sMembers(
      "login:" + id + "associated_user_ids"
    );
    await this.redis.sRem(
      "login:" + id + "associated_user_ids",
      associatedUserIds
    );

    const allFields = await this.redis.hKeys("login:" + id);
    const nbrOfDeletedFields = await this.redis.hDel("login:" + id, allFields);

    return Promise.resolve(nbrOfDeletedFields > 0);
  }

  async deleteReminder(id: string): Promise<boolean> {
    const reminderData = await this.redis.hGetAll("reminder:" + id);
    if (!reminderData) {
      return Promise.reject("No reminderData found with id: " + id);
    }
    await this.redis.sRem("user:" + reminderData.ownerId + "reminders", id);
    const allFields = await this.redis.hKeys("reminder:" + id);
    const nbrOfDeletedFields = await this.redis.hDel(
      "reminder:" + id,
      allFields
    );
    return Promise.resolve(nbrOfDeletedFields > 0);
  }

  async deleteUser(id: string): Promise<boolean> {
    const userData = await this.redis.hGetAll("user:" + id);
    if (!userData) {
      return Promise.reject("No user found with id: " + id);
    }
    await this.redis.sRem(
      "login:" + userData.login + "associated_user_ids",
      id
    );
    const allFields = await this.redis.hKeys("user:" + id);
    const nbrOfDeletedFields = await this.redis.hDel("user:" + id, allFields);
    return Promise.resolve(nbrOfDeletedFields > 0);
  }

  getAllLoginIds(): Promise<string[]> {
    return Promise.resolve([]);
  }

  getAllReminderIds(): Promise<string[]> {
    return Promise.resolve([]);
  }

  getAllUserIds(): Promise<string[]> {
    return Promise.resolve([]);
  }

  getLoginByEmail(email: string): Promise<Login | null> {
    return new Promise<Login | null>(async (resolve, reject) => {
      const loginId = await this.redis.hGet("logins", email);
      if (!loginId) {
        console.log("No login with that email in redis!!!");
        return reject();
      }

      const loginData = await this.redis.hGetAll("login:" + loginId);
      const associatedUserIds = await this.redis.sMembers(
        "login:" + loginId + "associated_user_ids"
      );
      return resolve(
        new Login(
          loginId,
          loginData.email,
          loginData.password,
          associatedUserIds
        )
      );
    });
  }

  getLoginById(id: string): Promise<Login | null> {
    return new Promise<Login | null>(async (resolve, reject) => {
      //   const loginData = await this.redis.hGetAll("login:" + id);
      //   const associatedUserIds = await this.redis.sMembers(
      //     "login:" + id + "associated_user_ids"
      //   );
      //   if (loginData && associatedUserIds) {
      //     console.log("Login Data: ", loginData);
      //     return resolve(
      //       new Login(id, loginData.email, loginData.password, associatedUserIds)
      //     );
      //   } else {
      //     console.log("No login data found in redis for id: ", id);
      //     return resolve(null);
      //   }

      return await Promise.all([
        this.redis.hGetAll("login:" + id),
        this.redis.sMembers("login:" + id + "associated_user_ids"),
      ])
        .then((results) => {
          console.log("results: ", results);
          return resolve(
            new Login(id, results[0].email, results[0].password, results[1])
          );
        })
        .catch((reason) => {
          console.log("Reason: ", reason);
          return resolve(null);
        });
    });
  }

  getReminderById(id: string): Promise<Reminder | null> {
    return new Promise<Reminder | null>(async (resolve, reject) => {
      const reminderData = await this.redis.hGetAll("reminder:" + id);
      if (reminderData) {
        return resolve(
          new Reminder(
            id,
            reminderData.title,
            new Date(reminderData.date),
            reminderData.ownerId
          )
        );
      } else {
        console.log("No reminder data found in redis for id: ", id);
        return resolve(null);
      }
    });
  }

  getUserById(id: string): Promise<User | null> {
    return new Promise<User | null>(async (resolve, reject) => {
      const userData = await this.redis.hGetAll("user:" + id);
      const login = await this.getLoginById(userData.login);
      if (userData && login) {
        return resolve(
          new User(
            id,
            login,
            userData.role as UserRole,
            userData.firstname,
            userData.lastname
          )
        );
      } else {
        console.log("No user data found in redis for id: ", id);
        return resolve(null);
      }
    });
  }

  getRemindersByUser(userId: string): Promise<Reminder[] | null> {
    return new Promise<Reminder[] | null>(async (resolve, reject) => {
      // this.redis.sAdd("user:" + ownerId + "reminders", reminderId.toString())
      const reminderIds = await this.redis.sMembers(
        "user:" + userId + "reminders"
      );
      let remindersToReturn = [];
      for (const reminderId of reminderIds) {
        const reminder = await this.getReminderById(reminderId);
        if (reminder) {
          remindersToReturn.push(reminder);
        }
      }
      resolve(remindersToReturn);
    });
  }
}
