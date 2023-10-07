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
    AccountService,
    LoginService,
    ReminderNotificationService,
    ReminderService,
    UserService
} from "./core/components/reminderContext/application/services/index.js";
import {PasswordManager} from "./core/components/reminderContext/domain/services/index.js";
import {BcryptHasher} from "./infrastructure/security/BcryptHasher.js";
import {Hasher} from "./core/portsAndInterfaces/interfaces/Hasher.js";
import {MyJobScheduler} from "./infrastructure/scheduledJobs/MyJobScheduler.js";
import {MyPushNotificationService} from "./infrastructure/notifications/MyPushNotificationService.js";
import {InitializePeriodicReminderChecksUseCase} from "./core/portsAndInterfaces/ports/index.js";
import {
    InitializePeriodicReminderChecksUseCaseHandler
} from "./core/components/reminderContext/application/useCases/index.js";


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
app.use(morgan('dev'));

// **************************************
//       Express middlewares
// **************************************
const loggingMiddleware = (req: any, res: any, next: any) => {
    console.log('ip:', req.ip);
    next();
}
app.use(loggingMiddleware);

app.use(cors({
    origin: 'http://localhost:61036',
}));


const createViewerMiddleware = async (req: any, res: any, next: any) => {
    const myViewer = new Viewer(req.headers, process.env.SECRET as string);
    await myViewer.prepareViewer().then(() => {
        console.log("Prepared Viewer");
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
const pushNotificationService = new MyPushNotificationService();

// Core:
const passwordManager = new PasswordManager(hasher);
const userService = new UserService(redisRepository);
const loginService = new LoginService(redisRepository, passwordManager);
const accountService = new AccountService(loginService, userService, passwordManager);
const reminderService = new ReminderService(redisRepository);
const reminderNotificationService = new ReminderNotificationService(reminderService, userService, pushNotificationService)

// Presentation
const initializePeriodicReminderChecksUseCase: InitializePeriodicReminderChecksUseCase = new InitializePeriodicReminderChecksUseCaseHandler(jobScheduler, reminderNotificationService)

// Startup Jobs
if(resetRedisOnStartup){
    redisRepository.redis.flushDb();
    const rootViewer = Viewer.Root();
    await accountService.signUp(rootViewer, "luca@gmail.com", "Hallo1234", "Luca Sahli");
    await accountService.signUp(rootViewer, "demo@gmail.com", "Hallo1234", "Demo Account");
    await accountService.signUp(rootViewer, "dummy@gmail.com", "Hallo1234", "Dummy Account");

    await redisRepository.addReminder("Pay Bills!", "1", ["1"], false, new Date("2030-01-01T09:15:00.000Z"), undefined);
    await redisRepository.addReminder("Call Mom!", "1", ["1"], false, new Date("2030-01-02T10:15:00.000Z"), undefined);
    await redisRepository.addReminder("Clean bathroom!", "1", ["1"], false, new Date("2030-03-01T11:15:00.000Z"), undefined);
    await redisRepository.addReminder("Clean entry!", "1", ["1"], true, new Date("2020-03-01T11:15:00.000Z"), undefined);
    await redisRepository.addReminder("Buy towels", "1", ["1"], true, new Date("2020-05-01T09:15:00.000Z"), undefined);

    await redisRepository.addReminder("Pay taxes!", "2", ["2"], false, new Date("2030-01-01T09:15:00.000Z"), undefined);
    await redisRepository.addReminder("Call Dad!", "2", ["2"], false, new Date("2030-01-02T10:15:00.000Z"), undefined);
    await redisRepository.addReminder("Clean kitchen!", "2", ["2"], false, new Date("2030-03-01T11:15:00.000Z"), undefined);
    await redisRepository.addReminder("Ask andy for his car", "2", ["2"], true, new Date("2020-03-01T11:15:00.000Z"), undefined);
    await redisRepository.addReminder("Buy bread", "2", ["2"], true, new Date("2020-05-01T09:15:00.000Z"), undefined);

    await redisRepository.addReminder("Pay Salt bill!", "3", ["1", "2", "3"], false, new Date("2030-01-01T09:15:00.000Z"), undefined);
    await redisRepository.addReminder("Call Lisa!", "3", ["1", "2", "3"], false, new Date("2030-01-02T10:15:00.000Z"), undefined);
    await redisRepository.addReminder("Clean garage!", "3", ["1", "2", "3"], false, new Date("2030-03-01T11:15:00.000Z"), undefined);
    await redisRepository.addReminder("Ask Beni for his bike", "3", ["1", "2", "3"], true, new Date("2020-03-01T11:15:00.000Z"), undefined);
    await redisRepository.addReminder("Buy water", "3", ["1", "2", "3"], true, new Date("2020-05-01T09:15:00.000Z"), undefined);
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
    // Add other properties as needed
}

const graphqlContext = {
    userService: userService,
    passwordManager: passwordManager,
    loginService: loginService,
    accountService: accountService,
    reminderService: reminderService,
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
