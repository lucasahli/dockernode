import {GraphQlContext} from "../../../main.js";
import {
  GetUsersByLoginUseCase,
  SignInUseCase,
  SignUpUseCase
} from "../../../core/portsAndInterfaces/ports/index.js";
import {GraphQLResolveInfo} from "graphql/type/index.js";
import {
  GetUsersByLoginUseCaseHandler, SignInUseCaseHandler, SignUpUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/index.js";
import {RefreshAccessUseCase} from "../../../core/portsAndInterfaces/ports/RefreshAccessUseCase.js";
import {
  RefreshAccessUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/RefreshAccessUseCaseHandler.js";

/** When setting up a field whose value is a custom type,
 * we have to define a function that tells GraphQL how to get that custom type.
 * For example: The User type has a reminders field.
 * We do that by defining a new root property inside resolvers.
 */

export default {
  Login: {
    users: async (parent: any, args: any, context: GraphQlContext) => {
      const getUsersByLoginUseCase: GetUsersByLoginUseCase = new GetUsersByLoginUseCaseHandler(context.accountService, context.sessionService, context.sessionActivityService);
      return getUsersByLoginUseCase.execute(context.viewer, parent.id);
    },
  },

  SignUpResult: {
    __resolveType(obj: any, context: any, info: GraphQLResolveInfo){
      if(obj.accessToken){
        return 'SignUpSuccess';
      }
      if(obj.title){
        return 'SignUpProblem';
      }
      return null; // GraphQLError is thrown
    },
  },

  SignInResult: {
    __resolveType(obj: any, context: any, info: GraphQLResolveInfo){
      if(obj.accessToken){
        return 'SignInSuccess';
      }
      if(obj.title){
        return 'SignInProblem';
      }
      return null; // GraphQLError is thrown
    },
  },

  RefreshAccessResult: {
    __resolveType(obj: any, context: any, info: GraphQLResolveInfo){
      if(obj.accessToken){
        return 'RefreshAccessSuccess';
      }
      else {
        return 'RefreshAccessProblem';
      }
      return null; // GraphQLError is thrown
    },
  },

  Mutation: {
    signUp: async (parent: any, args: any, context: GraphQlContext) => {
      const signUpUseCase: SignUpUseCase = new SignUpUseCaseHandler(context.accountService);
      return signUpUseCase.execute(context.viewer, args.email, args.password, args.fullName);
    },
    signIn: async (parent: any, args: any, context: GraphQlContext) => {
      const signInUseCase: SignInUseCase = new SignInUseCaseHandler(context.accountService);
      return signInUseCase.execute(context.viewer, args.email, args.password);
    },
    refreshAccess: async (parent: any, args: any, context: GraphQlContext) => {
      const refreshAccessUseCase: RefreshAccessUseCase = new RefreshAccessUseCaseHandler(context.accountService, context.sessionService, context.sessionActivityService);
      return refreshAccessUseCase.execute(context.viewer, args.refreshToken);
    },
  },
};
