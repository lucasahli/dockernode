import { graphQlApiPresenter } from "../GraphQlApiPresenter.js";
import {Viewer} from "../../../core/sharedKernel/Viewer.js";

/** When setting up a field whose value is a custom type,
 * we have to define a function that tells GraphQL how to get that custom type.
 * For example: The User type has a reminders field.
 * We do that by defining a new root property inside resolvers.
 */

export default {
  Login: {
    users: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleLoginUsersFieldQuery(parent, args, viewer); },
  },

  Mutation: {
    signUp: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleSignUpMutation(parent, args, viewer); },
    signIn: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleSignInMutation(parent, args, viewer); },
  },
};
