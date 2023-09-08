import {Viewer} from "../../../core/sharedKernel/Viewer.js";
import {graphQlApiPresenter} from "../GraphQlApiPresenter.js";

import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql';
import {
    CreateReminderUseCase, DeleteReminderByIdUseCase,
    GetAllRemindersUseCase,
    GetReminderByIdUseCase,
    GetUserByIdUseCase
} from "../../../core/portsAndInterfaces/ports/index.js";
import {
    CreateReminderUseCaseHandler, DeleteReminderByIdUseCaseHandler,
    GetAllRemindersUseCaseHandler,
    GetReminderByIdUseCaseHandler, GetUserByIdUseCaseHandler
} from "../../../core/components/reminderContext/application/useCases/index.js";
import {GraphQlContext} from "../../../main.js";


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

    Query: {
        reminders: async (parent: any, args: any, context: GraphQlContext) => {
            const getAllRemindersUseCase: GetAllRemindersUseCase = new GetAllRemindersUseCaseHandler(context.reminderService)
            return getAllRemindersUseCase.execute(context.viewer);
            },
        reminder: async (parent: any, args: any, context: GraphQlContext) => {
            const getReminderByIdUseCase: GetReminderByIdUseCase = new GetReminderByIdUseCaseHandler(context.reminderService);
            return getReminderByIdUseCase.execute(context.viewer, args.id);
            },
    },
    Reminder: {
        owner: async (parent: any, args: any, context: GraphQlContext) => {
            const getUserByIdUseCase: GetUserByIdUseCase = new GetUserByIdUseCaseHandler(context.userService);
            return getUserByIdUseCase.execute(context.viewer, parent.ownerId);
            },
    },
    Mutation: {
        createReminder: async (parent: any, args: any, context: GraphQlContext) => {
            const createReminderUseCase: CreateReminderUseCase = new CreateReminderUseCaseHandler(context.reminderService);
            return createReminderUseCase.execute(context.viewer, args.title, args.dateTimeToRemind);
            },
        deleteReminder: async (parent: any, args: any, context: GraphQlContext) => {
            const deleteReminderByIdUseCase: DeleteReminderByIdUseCase = new DeleteReminderByIdUseCaseHandler(context.reminderService);
            return deleteReminderByIdUseCase.execute(context.viewer, args.id);
            },
    },
};