import {
    GetAllUsersUseCase, GetLoginByUserUseCase, GetRemindersByOwnerIdUseCase,
    GetUserByIdUseCase
} from "../../../core/portsAndInterfaces/ports/index.js";
import {GetRemindersByOwnerIdUseCaseHandler} from "../../../core/components/reminderContext/application/useCases/index.js";
import {GraphQlContext} from "../../../main.js";
import {
    GetAllUsersUseCaseHandler, GetLoginByUserUseCaseHandler,
    GetUserByIdUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/index.js";

/** When setting up a field whose value is a custom type,
 * we have to define a function that tells GraphQL how to get that custom type.
 * For example: The User type has a reminders field.
 * We do that by defining a new root property inside resolvers.
 */

export default {
    Query: {
        me: async (parent: any, args: any, context: GraphQlContext) => {
            await context.viewer.prepareViewer();
            if(context.viewer.userId){
                const getUserByIdUseCase: GetUserByIdUseCase = new GetUserByIdUseCaseHandler(context.userService, context.sessionService, context.sessionActivityService);
                return getUserByIdUseCase.execute(context.viewer, context.viewer.userId);
            }
            else {
                console.log("No Viewer with userId!!!");
                return null;
            }
        },
        users: async (parent: any, args: any, context: GraphQlContext) => {
            const getAllUsersUseCase: GetAllUsersUseCase = new GetAllUsersUseCaseHandler(context.userService, context.sessionService, context.sessionActivityService)
            return getAllUsersUseCase.execute(context.viewer);
            },
        user: async (parent: any, args: any, context: GraphQlContext) => {
            const getUserByIdUseCase: GetUserByIdUseCase = new GetUserByIdUseCaseHandler(context.userService, context.sessionService, context.sessionActivityService);
            return getUserByIdUseCase.execute(context.viewer, args.id);
            },
    },

    User: {
        // Reminders By Owner
        reminders: async (parent: any, args: any, context: GraphQlContext) => {
            const getRemindersByOwnerIdUseCase: GetRemindersByOwnerIdUseCase = new GetRemindersByOwnerIdUseCaseHandler(context.reminderService, context.sessionService, context.sessionActivityService);
            return getRemindersByOwnerIdUseCase.execute(context.viewer, parent.id);
            },
        // Login of a User
        login: async (parent: any, args: any, context: GraphQlContext) => {
            const getLoginByUserUseCase: GetLoginByUserUseCase = new GetLoginByUserUseCaseHandler(context.accountService, context.sessionService, context.sessionActivityService);
            return getLoginByUserUseCase.execute(context.viewer, parent.id);
            },
    },

    Mutation: {
        deleteUser: async (parent: any, args: any, context: GraphQlContext) => {
            return false;
            },
    },
};