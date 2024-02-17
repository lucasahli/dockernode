import 'dotenv/config';
import morgan from 'morgan'; // HTTP request logger.
import helmet from "helmet"; // Helps secure your apps by setting various HTTP headers.
import express, {Express} from 'express';
import {Viewer} from "./core/sharedKernel/Viewer.js";
import {createHandler} from 'graphql-http/lib/use/express';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {loadSchemaSync} from '@graphql-tools/load';
import {loadFiles} from '@graphql-tools/load-files';
import {GraphQLFileLoader} from '@graphql-tools/graphql-file-loader';
import {mergeResolvers} from "@graphql-tools/merge";
import url from 'url';
import cors from 'cors';
import {RedisRepository} from "./infrastructure/persistence/redis/RedisRepository.js";
import {
    ReminderNotificationService,
    ReminderService
} from "./core/components/reminderContext/application/services/index.js";
import {
    AccountService,
    LoginService, SessionActivityService,
    UserService
} from "./core/components/userSessionContext/application/services/index.js";
import {PasswordManager} from "./core/components/userSessionContext/domain/services/index.js";
import {BcryptHasher} from "./infrastructure/security/BcryptHasher.js";
import {Hasher} from "./core/portsAndInterfaces/interfaces/Hasher.js";
import {MyJobScheduler} from "./infrastructure/scheduledJobs/MyJobScheduler.js";
import {FirebaseCloudMessagingNotificationService} from "./infrastructure/notifications/FirebaseCloudMessagingNotificationService.js";
import {InitializePeriodicReminderChecksUseCase} from "./core/portsAndInterfaces/ports/index.js";
import {
    InitializePeriodicReminderChecksUseCaseHandler
} from "./core/components/reminderContext/application/useCases/index.js";
import {
    DeviceService,
    RefreshTokenService,
    SessionService
} from "./core/components/userSessionContext/application/services/index.js";


// **************************************
//          Environment Setup
// **************************************
// const isTest = !!process.env.TEST_DATABASE;
// const isProduction = !!process.env.DATABASE_URI;
// const port = isTest ? process.env.SERVER_TEST_PORT : process.env.API_SERVER_PORT;

// **************************************
//         Express App Setup
// **************************************
const app: Express = express();

app.use(helmet({
    contentSecurityPolicy: false,
}));
// app.use(morgan('dev'));

// **************************************
//       Express middlewares
// **************************************
// When to Store:
//
// Session data and device information can be stored at key points in your application's logic. For example:
//  - For session data, you can store login and logout events or track activity during a session.
//  - For device information, you can store device registration when a user adds a new device and update the last
//    used time during access.
const loggingMiddleware = (req: any, res: any, next: any) => {
    // console.log('ip:', req.ip);
    next();
}
app.use(loggingMiddleware);

app.use(cors({
    origin: '*',
}));


const createViewerMiddleware = async (req: any, res: any, next: any) => {
    const myViewer = new Viewer(req.headers, process.env.SECRET as string);
    await myViewer.prepareViewer().then(() => {
        res.locals.myViewer = myViewer;
    });
    next();
}
app.use(createViewerMiddleware);

// **************************************
//       GraphQl: Schema / Resolvers
// **************************************
const resolverFiles = await loadFiles("dist/presentation/graphQL/resolvers/*.js", {
    ignoreIndex: true,
    requireMethod: async (path: string) => {
      return await import(url.pathToFileURL(path).toString());
    },
});
const resolvers = mergeResolvers(resolverFiles);
const executableSchema = makeExecutableSchema({
    typeDefs: loadSchemaSync('src/presentation/graphQL/schema/*.graphql', {
        loaders: [new GraphQLFileLoader()],
    }),
    resolvers: resolvers,
});

// **************************************
//          GraphQl: Endpoint
// **************************************

// Infrastructure:
const resetRedisOnStartup = true;
const redisRepository = new RedisRepository(
    `${process.env.REDIS_HOST}`,
    `${process.env.REDIS_PORT}`
);
if(resetRedisOnStartup){
    redisRepository.redis.flushDb();
}

const hasher: Hasher = new BcryptHasher();
const jobScheduler = new MyJobScheduler();
const pushNotificationService = new FirebaseCloudMessagingNotificationService();

// Core:
const passwordManager = new PasswordManager(hasher);
const userService = new UserService(redisRepository);
const loginService = new LoginService(redisRepository, passwordManager);
const deviceService = new DeviceService(redisRepository);
const sessionService = new SessionService(redisRepository);
const sessionActivityService = new SessionActivityService(redisRepository);
const refreshTokenService = new RefreshTokenService(redisRepository);
const accountService = new AccountService(loginService, userService, passwordManager, deviceService, sessionService, refreshTokenService);
const reminderService = new ReminderService(redisRepository);
const reminderNotificationService = new ReminderNotificationService(reminderService, userService, loginService, deviceService, pushNotificationService);

// Presentation
const initializePeriodicReminderChecksUseCase: InitializePeriodicReminderChecksUseCase = new InitializePeriodicReminderChecksUseCaseHandler(jobScheduler, reminderNotificationService)

// Startup Jobs
if(resetRedisOnStartup){
    await redisRepository.redis.flushDb();
    const rootViewer = Viewer.Root();
    try {
        await accountService.signUp(rootViewer, "luca@gmail.com", "Hallo1234", "Luca Sahli");
    }
    catch (e) {
        console.log("CATCHED ERROR: ", e);
    }
    try {
        await accountService.signUp(rootViewer, "demo@gmail.com", "Hallo1234", "Demo Account");
    }
    catch (e) {
        console.log("CATCHED ERROR: ", e);
    }
    try {
        await accountService.signUp(rootViewer, "dummy@gmail.com", "Hallo1234", "Dummy Account");
    }
    catch (e) {
        console.log("CATCHED ERROR: ", e);
    }




    await redisRepository.createReminder("Pay Bills!", "1", ["1"], false, new Date("2030-01-01T09:15:00.000Z"), undefined);
    await redisRepository.createReminder("Call Mom!", "1", ["1"], false, new Date("2030-01-02T10:15:00.000Z"), undefined);
    await redisRepository.createReminder("Clean bathroom!", "1", ["1"], false, new Date("2030-03-01T11:15:00.000Z"), undefined);
    await redisRepository.createReminder("Clean entry!", "1", ["1"], true, new Date("2020-03-01T11:15:00.000Z"), undefined);
    await redisRepository.createReminder("Buy towels", "1", ["1"], true, new Date("2020-05-01T09:15:00.000Z"), undefined);

    await redisRepository.createReminder("Pay taxes!", "2", ["2"], false, new Date("2030-01-01T09:15:00.000Z"), undefined);
    await redisRepository.createReminder("Call Dad!", "2", ["2"], false, new Date("2030-01-02T10:15:00.000Z"), undefined);
    await redisRepository.createReminder("Clean kitchen!", "2", ["2"], false, new Date("2030-03-01T11:15:00.000Z"), undefined);
    await redisRepository.createReminder("Ask andy for his car", "2", ["2"], true, new Date("2020-03-01T11:15:00.000Z"), undefined);
    await redisRepository.createReminder("Buy bread", "2", ["2"], true, new Date("2020-05-01T09:15:00.000Z"), undefined);

    await redisRepository.createReminder("Pay Salt bill!", "3", ["1", "2", "3"], false, new Date("2030-01-01T09:15:00.000Z"), undefined);
    await redisRepository.createReminder("Call Lisa!", "3", ["1", "2", "3"], false, new Date("2030-01-02T10:15:00.000Z"), undefined);
    await redisRepository.createReminder("Clean garage!", "3", ["1", "2", "3"], false, new Date("2030-03-01T11:15:00.000Z"), undefined);
    await redisRepository.createReminder("Ask Beni for his bike", "3", ["1", "2", "3"], true, new Date("2020-03-01T11:15:00.000Z"), undefined);
    await redisRepository.createReminder("Buy water", "3", ["1", "2", "3"], true, new Date("2020-05-01T09:15:00.000Z"), undefined);
}

console.log("Current Date and Time: ", new Date().toISOString());
initializePeriodicReminderChecksUseCase.execute()
    .then(() => {
        console.log('Started periodic Reminder Checks...');
    })
    .catch(() => {
        console.log('Could not start periodic Reminder Checks!!!');
    });

export interface GraphQlContext {
    viewer: Viewer;
    userService: UserService;
    passwordManager: PasswordManager;
    loginService: LoginService;
    accountService: AccountService;
    reminderService: ReminderService;
    deviceService: DeviceService;
    sessionService: SessionService;
    sessionActivityService: SessionActivityService;
    // Add other properties as needed
}

const graphqlContext = {
    userService: userService,
    passwordManager: passwordManager,
    loginService: loginService,
    accountService: accountService,
    reminderService: reminderService,
    deviceService: deviceService,
    sessionService: sessionService,
    sessionActivityService: sessionActivityService
};


app.use('/graphql', createHandler({
    schema: executableSchema, 
    context: async (req, args) => {
        return {
            ...graphqlContext,
            viewer: req.context.res.locals.myViewer,
        };
    },
}),);

app.listen(process.env.API_SERVER_PORT,
    () => console.log(`Running a GraphQL API server at http://127.0.0.1:${process.env.API_SERVER_PORT}/graphql`)
);
