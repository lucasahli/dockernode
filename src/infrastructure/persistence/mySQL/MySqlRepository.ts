// import {UserRepository} from "../../../core/portsAndInterfaces/interfaces/UserRepository.js";
// import {User} from "../../../core/components/reminderContext/domain/entities/User.js";
// import {
//     Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
//     HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
//     HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
//     HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, Model, ModelDefined, Optional,
//     Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey,
// } from 'sequelize';
// import {ReminderRepository} from "../../../core/portsAndInterfaces/interfaces/ReminderRepository.js";
// import {Reminder} from "../../../core/components/reminderContext/domain/entities/Reminder.js";
// import {LoginRepository} from "../../../core/portsAndInterfaces/interfaces/LoginRepository.js";
// import {Login} from "../../../core/components/reminderContext/domain/entities/Login.js";
//
// // const uuidv4 = require('uuid/v4');
//
// // ***********************************************
// // Important:
// // You must use declare on your class properties typings
// // to ensure TypeScript does not emit those class properties.
// // ***********************************************
//
// class SequelizeLoginModel extends Model<InferAttributes<SequelizeLoginModel>, InferCreationAttributes<SequelizeLoginModel>> {
//     // id can be undefined during creation when using `autoIncrement`
//     declare id: CreationOptional<string>;
//     declare email: string;
//     declare password: string;
//     // You can also pre-declare possible inclusions, these will only be populated if you
//     // actively include a relation.
//     declare users?: NonAttribute<SequelizeUserModel[]>; // Note this is optional since it's only populated when explicitly requested in code
//
//
//     // timestamps!
//     // createdAt can be undefined during creation
//     declare createdAt: CreationOptional<Date>;
//     // updatedAt can be undefined during creation
//     declare updatedAt: CreationOptional<Date>;
//
//     // Since TS cannot determine model association at compile time
//     // we have to declare them here purely virtually
//     // these will not exist until `Model.init` was called.
//     declare getUsers: HasManyGetAssociationsMixin<SequelizeUserModel>; // Note the null assertions!
//     declare addUser: HasManyAddAssociationMixin<SequelizeUserModel, string>;
//     declare addUsers: HasManyAddAssociationsMixin<SequelizeUserModel, string>;
//     declare setUsers: HasManySetAssociationsMixin<SequelizeUserModel, string>;
//     declare removeUser: HasManyRemoveAssociationMixin<SequelizeUserModel, string>;
//     declare removeUsers: HasManyRemoveAssociationsMixin<SequelizeUserModel, string>;
//     declare hasUser: HasManyHasAssociationMixin<SequelizeUserModel, string>;
//     declare hasUsers: HasManyHasAssociationsMixin<SequelizeUserModel, string>;
//     declare countUsers: HasManyCountAssociationsMixin;
//     declare createUser: HasManyCreateAssociationMixin<SequelizeUserModel, 'loginId'>;
//
//     declare static associations: {
//         // Source, Target
//         users: Association<SequelizeLoginModel, SequelizeUserModel>;
//     };
// }
//
// // order of InferAttributes & InferCreationAttributes is important.
// class SequelizeUserModel extends Model<InferAttributes<SequelizeUserModel, { omit: 'reminders' }>, InferCreationAttributes<SequelizeUserModel, { omit: 'reminders' }>> {
//     // id can be undefined during creation when using `autoIncrement`
//     declare id: CreationOptional<string>;
//     declare loginId: ForeignKey<SequelizeLoginModel['id']>;
//     declare role: string;
//     declare firstname: string | null; // for nullable fields
//     declare lastname: string | null; // for nullable fields
//
//     // timestamps!
//     // createdAt can be undefined during creation
//     declare createdAt: CreationOptional<Date>;
//     // updatedAt can be undefined during creation
//     declare updatedAt: CreationOptional<Date>;
//
//     // Since TS cannot determine model association at compile time
//     // we have to declare them here purely virtually
//     // these will not exist until `Model.init` was called.
//     declare getReminders: HasManyGetAssociationsMixin<SequelizeReminderModel>; // Note the null assertions!
//     declare addReminder: HasManyAddAssociationMixin<SequelizeReminderModel, string>;
//     declare addReminders: HasManyAddAssociationsMixin<SequelizeReminderModel, string>;
//     declare setReminders: HasManySetAssociationsMixin<SequelizeReminderModel, string>;
//     declare removeReminder: HasManyRemoveAssociationMixin<SequelizeReminderModel, string>;
//     declare removeReminders: HasManyRemoveAssociationsMixin<SequelizeReminderModel, string>;
//     declare hasReminder: HasManyHasAssociationMixin<SequelizeReminderModel, string>;
//     declare hasReminders: HasManyHasAssociationsMixin<SequelizeReminderModel, string>;
//     declare countReminders: HasManyCountAssociationsMixin;
//     declare createReminder: HasManyCreateAssociationMixin<SequelizeReminderModel, 'ownerId'>;
//
//     // You can also pre-declare possible inclusions, these will only be populated if you
//     // actively include a relation.
//     declare reminders?: NonAttribute<SequelizeReminderModel[]>; // Note this is optional since it's only populated when explicitly requested in code
//
//     declare static associations: {
//         reminders: Association<SequelizeUserModel, SequelizeReminderModel>;
//     };
// }
//
//
// class SequelizeReminderModel extends Model<
//     InferAttributes<SequelizeReminderModel>,
//     InferCreationAttributes<SequelizeReminderModel>
//     > {
//     // id can be undefined during creation when using `autoIncrement`
//     declare id: CreationOptional<string>;
//
//     // foreign keys are automatically added by associations methods (like SequelizeReminderModel.belongsTo)
//     // by branding them using the `ForeignKey` type, `SequelizeReminderModel.init` will know it does not need to
//     // display an error if ownerId is missing.
//     declare ownerId: ForeignKey<SequelizeUserModel['id']>;
//     declare title: string;
//     declare date: Date;
//
//     // `owner` is an eagerly-loaded association.
//     // We tag it as `NonAttribute`
//     declare owner?: NonAttribute<SequelizeUserModel>;
//
//     // createdAt can be undefined during creation
//     declare createdAt: CreationOptional<Date>;
//     // updatedAt can be undefined during creation
//     declare updatedAt: CreationOptional<Date>;
// }
//
// class SequelizeAddressModel extends Model<
//     InferAttributes<SequelizeAddressModel>,
//     InferCreationAttributes<SequelizeAddressModel>
//     > {
//     declare userId: ForeignKey<SequelizeUserModel['id']>;
//     declare address: string;
//
//     // createdAt can be undefined during creation
//     declare createdAt: CreationOptional<Date>;
//     // updatedAt can be undefined during creation
//     declare updatedAt: CreationOptional<Date>;
// }
//
//
//
//
// export class MySqlRepository implements LoginRepository, UserRepository, ReminderRepository{
//     dbURI = process.env.DATABASE_DIALECT
//         + "://" + process.env.DATABASE_USER
//         // + ":" + process.env.DATABASE_PASSWORD
//         + "@" + process.env.DATABASE_HOST
//         + ":" + process.env.DATABASE_PORT
//         + "/" + process.env.DATABASE_SCHEMA_NAME;
//     public sequelize = new Sequelize(this.dbURI);
//
//     constructor() {
//         SequelizeLoginModel.init(
//             {
//                 id: {
//                     type: DataTypes.UUID,
//                     defaultValue: DataTypes.UUIDV4,
//                     allowNull: false,
//                     primaryKey: true
//                 },
//                 email: {
//                     type: new DataTypes.STRING(128),
//                     allowNull: false,
//                     unique: true
//                 },
//                 password: {
//                     type: new DataTypes.STRING(128),
//                     allowNull: false
//                 },
//                 createdAt: DataTypes.DATE,
//                 updatedAt: DataTypes.DATE,
//             },
//             {
//                 sequelize: this.sequelize,
//                 tableName: "login"
//             }
//         );
//
//         SequelizeUserModel.init(
//             {
//                 id: {
//                     type: DataTypes.UUID,
//                     defaultValue: DataTypes.UUIDV4,
//                     allowNull: false,
//                     primaryKey: true
//                 },
//                 role: {
//                     type: new DataTypes.STRING(128),
//                     allowNull: false,
//                     unique: false
//                 },
//                 firstname: {
//                     type: new DataTypes.STRING(128),
//                     allowNull: true,
//                     unique: false
//                 },
//                 lastname: {
//                     type: new DataTypes.STRING(128),
//                     allowNull: true,
//                     unique: false
//                 },
//                 createdAt: DataTypes.DATE,
//                 updatedAt: DataTypes.DATE,
//             },
//             {
//                 sequelize: this.sequelize,
//                 tableName: "userData"
//             }
//         );
//
//         SequelizeReminderModel.init(
//             {
//                 id: {
//                     type: DataTypes.UUID,
//                     defaultValue: DataTypes.UUIDV4,
//                     primaryKey: true
//                 },
//                 title: {
//                     type: new DataTypes.STRING(128),
//                     allowNull: false
//                 },
//                 date: {
//                     type: DataTypes.DATE,
//                     allowNull: false
//                 },
//                 createdAt: DataTypes.DATE,
//                 updatedAt: DataTypes.DATE,
//             },
//             {
//                 sequelize: this.sequelize,
//                 tableName: 'reminders'
//             }
//         );
//
//         SequelizeAddressModel.init(
//             {
//                 address: {
//                     type: new DataTypes.STRING(128),
//                     allowNull: false
//                 },
//                 createdAt: DataTypes.DATE,
//                 updatedAt: DataTypes.DATE,
//             },
//             {
//                 tableName: 'address',
//                 sequelize: this.sequelize // passing the `sequelize` instance is required
//             }
//         );
//
//
//
//         // Here we associate which actually populates out pre-declared `association` static and other methods.
//         SequelizeUserModel.hasMany(SequelizeReminderModel, {
//             sourceKey: 'id',
//             foreignKey: 'ownerId',
//             as: 'reminders' // this determines the name in `associations`!
//         });
//
//         SequelizeAddressModel.belongsTo(SequelizeUserModel, { targetKey: 'id' });
//         SequelizeUserModel.hasOne(SequelizeAddressModel, { sourceKey: 'id' });
//
//
//         // Here we associate which actually populates out pre-declared `association` static and other methods.
//         SequelizeLoginModel.hasMany(SequelizeUserModel, {
//             foreignKey: 'login',
//             as: 'associatedUsers' // this determines the name in `associations`!
//         });
//
//
//         async function doStuffWithUser() {
//             const newLogin = await SequelizeLoginModel.create({
//                 email: 'Johnny',
//                 password: "JohnnyPW",
//             });
//             console.log("Created Johnny login...")
//             console.log(newLogin.id, newLogin.email, newLogin.password);
//
//             const user = await newLogin.createUser({
//                 firstname: 'Luca',
//                 lastname: 'Johnny',
//                 role: 'freemium'
//             });
//
//             const ourLogin = await SequelizeLoginModel.findByPk(newLogin.id, {
//                 include: [SequelizeLoginModel.associations.users],
//                 rejectOnEmpty: true // Specifying true here removes `null` from the return type!
//             });
//
//             // Note the `!` null assertion since TS can't know if we included
//             // the model or not
//             console.log(ourLogin.users![0].firstname);
//         }
//
//         (async () => {
//             await this.sequelize.sync()
//                 .then( (result) => {
//                     console.log("Could sync MySqlDatabase...");
//                 })
//                 .catch( (reason) => {
//                     console.log("Could not sync MySqlDatabase because: ", reason);
//                 })
//             await doStuffWithUser();
//         })();
//
//     }
//
//     getLoginById(id: string): Promise<Login | null> {
//         return new Promise<Login | null>( (resolve, reject) => {
//             SequelizeLoginModel.findByPk(id, {
//                 include: [SequelizeLoginModel.associations.reminders],
//                 rejectOnEmpty: false // Specifying true here removes `null` from the return type!
//             }).then( (sequelizeUserData) => {
//                 resolve(new Login(sequelizeUserData.id, sequelizeUserData.email, sequelizeUserData.password));
//             }).catch( (error) => {
//                 reject(error);
//             })
//         });
//     }
//
//     addLogin(login: Login): Promise<Login> {
//
//         return new Promise<Login>( (resolve, reject) => {
//             SequelizeLoginModel.create({login, password})
//                 .then((sequelizeUserData) => {
//                 console.log("Created user in SQL-Database...");
//                 resolve(new Login(sequelizeUserData.id, sequelizeUserData.email, sequelizeUserData.password));
//             })
//                 .catch((error) => {
//                 console.log("Could not create user in SQL-database: ", error);
//                 reject(Error(error));
//             })
//         });
//     }
//
//     getAllLoginIds(): Promise<string[]> {
//         return new Promise<string[]>((resolve, reject) => {
//             SequelizeLoginModel.findAll({attributes: ['id']})
//                 .then((userDataList) => {
//                     resolve(userDataList.map(user => { return user.id.toString(); }));
//                 })
//                 .catch((reason) => {
//                     reject(reason);
//                 })
//         });
//     }
//
//     getLoginByEmail(email: string): Promise<Login | null> {
//         return new Promise<Login | null>( (resolve, reject) => {
//             SequelizeLoginModel.findOne({
//                 attributes: ['id', 'email', 'password'],
//                 where: { email: email },
//                 rejectOnEmpty: false})
//                 .then((sequelizeUserData) => {
//                     resolve(new Login(sequelizeUserData.id, sequelizeUserData.email, sequelizeUserData.password));
//                 })
//                 .catch((error) => {
//                     reject(error);
//             })
//         });
//     }
//
//     deleteLogin(id: string): Promise<boolean> {
//         return new Promise<boolean>( (resolve, reject) => {
//             SequelizeLoginModel.destroy({where: {id: id}})
//                 .then((numberOfDeletedRows) => {
//                      resolve(numberOfDeletedRows >= 1);
//                 })
//                 .catch((reason) => {
//                     reject(false);
//                 })
//         });
//     }
//
// // ReminderRepository functions:
//     getReminderById(id: string): Promise<Reminder | null> {
//         return new Promise<Reminder | null>( (resolve, reject) => {
//             SequelizeReminderModel.findByPk(id, {
//                 rejectOnEmpty: false // Specifying true here removes `null` from the return type!
//             }).then((sequelizeReminderData) => {
//                 resolve(new Reminder(sequelizeReminderData.id, sequelizeReminderData.title, sequelizeReminderData.date));
//             }).catch((error) => {
//                 reject(error);
//             })
//         });
//     }
//
//     addReminder(title: string, date: Date): Promise<Reminder> {
//         return new Promise<Reminder>( (resolve, reject) => {
//             SequelizeReminderModel.create({title, date})
//                 .then((sequelizeReminderData) => {
//                     console.log("Created reminder in SQL-Database...");
//                     resolve(new Reminder(sequelizeReminderData.id, sequelizeReminderData.title, sequelizeReminderData.date));
//                 })
//                 .catch((error) => {
//                     console.log("Could not create Reminder: ", error);
//                     reject(Error(error));
//                 })
//         });
//     }
//
//     deleteReminder(id: string): Promise<boolean> {
//         return new Promise<boolean>( (resolve, reject) => {
//             SequelizeReminderModel.destroy({where: {id: id}})
//                 .then((numberOfDeletedRows) => {
//                     resolve(numberOfDeletedRows >= 1);
//                 })
//                 .catch((reason) => {
//                     reject(false);
//                 })
//         });
//     }
//
//     getAllReminderIds(): Promise<string[]> {
//         return new Promise<string[]>((resolve, reject) => {
//             SequelizeReminderModel.findAll({attributes: ['id']})
//                 .then((userDataList) => {
//                     resolve(userDataList.map(user => { return user.id.toString(); }));
//                 })
//                 .catch((reason) => {
//                     reject(reason);
//                 })
//         });
//     }
// }
//
// // async function doStuffWithUser() {
// //     const newUser = await SequelizeLoginModel.create({
// //         name: 'Johnny',
// //         preferredName: 'John',
// //     });
// //     console.log(newUser.id, newUser.name, newUser.preferredName);
// //
// //     const project = await newUser.createProject({
// //         name: 'first!'
// //     });
// //
// //     const ourUser = await SequelizeLoginModel.findByPk(1, {
// //         include: [SequelizeLoginModel.associations.projects],
// //         rejectOnEmpty: true // Specifying true here removes `null` from the return type!
// //     });
// //
// //     // Note the `!` null assertion since TS can't know if we included
// //     // the model or not
// //     console.log(ourUser.projects![0].name);
// // }