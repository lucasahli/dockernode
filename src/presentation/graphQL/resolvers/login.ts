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

/** When setting up a field whose value is a custom type,
 * we have to define a function that tells GraphQL how to get that custom type.
 * For example: The User type has a reminders field.
 * We do that by defining a new root property inside resolvers.
 */

export default {
  Login: {
    users: async (parent: any, args: any, context: GraphQlContext) => {
      const getUsersByLoginUseCase: GetUsersByLoginUseCase = new GetUsersByLoginUseCaseHandler(context.accountService);
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

  Mutation: {
    signUp: async (parent: any, args: any, context: GraphQlContext) => {
      const signUpUseCase: SignUpUseCase = new SignUpUseCaseHandler(context.accountService);
      return signUpUseCase.execute(context.viewer, args.email, args.password, args.fullName);
    },
    signIn: async (parent: any, args: any, context: GraphQlContext) => {
      const signInUseCase: SignInUseCase = new SignInUseCaseHandler(context.accountService);
      return signInUseCase.execute(context.viewer, args.email, args.password);
    },
  },
};
