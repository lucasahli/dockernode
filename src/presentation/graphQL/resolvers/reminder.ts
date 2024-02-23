import {Viewer} from "../../../core/sharedKernel/Viewer.js";
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql';
import {
    CreateReminderUseCase, DeleteReminderByIdUseCase,
    GetAllRemindersUseCase,
    GetReminderByIdUseCase, GetRemindersByOwnerIdUseCase,
    GetUserByIdUseCase, GetUsersByIdsUseCase
} from "../../../core/portsAndInterfaces/ports/index.js";
import {
    CreateReminderUseCaseHandler,
    DeleteReminderByIdUseCaseHandler,
    GetAllRemindersUseCaseHandler,
    GetReminderByIdUseCaseHandler,
    GetRemindersByOwnerIdUseCaseHandler
} from "../../../core/components/reminderContext/application/useCases/index.js";
import {GraphQlContext} from "../../../main.js";
import {GraphQLResolveInfo} from "graphql/type/index.js";
import {
    GetUserByIdUseCaseHandler,
    GetUsersByIdsUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/index.js";


export default {
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'Date custom scalar type including time',
        serialize(value) { // value sent to the client
          if (value instanceof Date) {
            return value.toISOString(); // Convert outgoing Date to ISO String for JSON
          }
          throw Error('GraphQL DateTime Scalar serializer expected a `Date` object');
        },
        parseValue(value) { // value from the client
          if (typeof value === 'string') {
            return new Date(value); // Convert incoming date time ISO string to Date
          }
          throw new Error('GraphQL DateTime Scalar parser expected a `string`');
        },
        parseLiteral(ast) {
          if (ast.kind === Kind.STRING) {
            // Convert hard-coded AST string to Date
            return new Date(ast.value);
          }
          // Invalid hard-coded value (not a string)
          return null;
        },
      }),

    CreateReminderResult: {
        __resolveType(obj: any, context: any, info: GraphQLResolveInfo){
            if(obj.createdReminder){
                return 'CreateReminderSuccess';
            }
            if(obj.title){
                return 'CreateReminderProblem';
            }
            return null; // GraphQLError is thrown
        },
    },

    Query: {
        myReminders: async (parent: any, args: any, context: GraphQlContext) => {
            if(context.viewer.userId){
                const getRemindersByOwnerIdUseCase: GetRemindersByOwnerIdUseCase = new GetRemindersByOwnerIdUseCaseHandler(context.reminderService, context.sessionService, context.sessionActivityService)
                return getRemindersByOwnerIdUseCase.execute(context.viewer, context.viewer.userId);
            }
            else {
                console.log("No Viewer with userId!!!");
                return null;
            }
        },
        reminders: async (parent: any, args: any, context: GraphQlContext) => {
            const getAllRemindersUseCase: GetAllRemindersUseCase = new GetAllRemindersUseCaseHandler(context.reminderService, context.sessionService, context.sessionActivityService)
            return getAllRemindersUseCase.execute(context.viewer);
            },
        remindersByOwner: async (parent: any, args: any, context: GraphQlContext) => {
            const ownerId = args.ownerId;
            const getRemindersByOwnerIdUseCase: GetRemindersByOwnerIdUseCase = new GetRemindersByOwnerIdUseCaseHandler(context.reminderService, context.sessionService, context.sessionActivityService)
            return getRemindersByOwnerIdUseCase.execute(context.viewer, ownerId);
        },
        reminder: async (parent: any, args: any, context: GraphQlContext) => {
            const getReminderByIdUseCase: GetReminderByIdUseCase = new GetReminderByIdUseCaseHandler(context.reminderService, context.sessionService, context.sessionActivityService);
            return getReminderByIdUseCase.execute(context.viewer, args.id);
            },
    },
    Reminder: {
        owner: async (parent: any, args: any, context: GraphQlContext) => {
            const getUserByIdUseCase: GetUserByIdUseCase = new GetUserByIdUseCaseHandler(context.userService, context.sessionService, context.sessionActivityService);
            return getUserByIdUseCase.execute(context.viewer, parent.ownerId);
            },
        usersToRemind: async (parent: any, args: any, context: GraphQlContext) => {
            const getUsersByIdsUseCase: GetUsersByIdsUseCase = new GetUsersByIdsUseCaseHandler(context.userService, context.sessionService, context.sessionActivityService);
            return getUsersByIdsUseCase.execute(context.viewer, parent.idsOfUsersToRemind);
        },
    },
    Mutation: {
        createReminder: async (parent: any, args: any, context: GraphQlContext) => {
            const createReminderUseCase: CreateReminderUseCase = new CreateReminderUseCaseHandler(context.reminderService, context.sessionService, context.sessionActivityService);
            return createReminderUseCase.execute(context.viewer, args.title, args.dateTimeToRemind);
            },
        deleteReminder: async (parent: any, args: any, context: GraphQlContext) => {
            const deleteReminderByIdUseCase: DeleteReminderByIdUseCase = new DeleteReminderByIdUseCaseHandler(context.reminderService, context.sessionService, context.sessionActivityService);
            return deleteReminderByIdUseCase.execute(context.viewer, args.id);
            },
    },
};