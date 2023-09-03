import { graphQlApiPresenter } from "../GraphQlApiPresenter.js";
import {Viewer} from "../../../core/sharedKernel/Viewer.js";

/** When setting up a field whose value is a custom type,
 * we have to define a function that tells GraphQL how to get that custom type.
 * For example: The User type has a reminders field.
 * We do that by defining a new root property inside resolvers.
 */

export default {
    Query: {
        users: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleUsersQuery(parent, args, viewer); },
        user: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleUserQuery(parent, args, viewer); },
    },

    User: {
        // Reminders By User
        reminders: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleUserRemindersFieldQuery(parent, args, viewer); },
        // Login of a User
        login: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleUserLoginFieldQuery(parent, args, viewer); },
    },

    Mutation: {
        deleteUser: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleDeleteUserMutation(parent, args, viewer); },
    },
};