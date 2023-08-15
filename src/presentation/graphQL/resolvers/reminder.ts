import {Viewer} from "../../../core/sharedKernel/Viewer.js";
import {graphQlApiPresenter} from "../GraphQlApiPresenter.js";

import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql';


export default {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        serialize(value) { // value sent to the client
          if (value instanceof Date) {
            return value.getTime(); // Convert outgoing Date to integer for JSON
          }
          throw Error('GraphQL Date Scalar serializer expected a `Date` object');
        },
        parseValue(value) { // value from the client
          if (typeof value === 'number') {
            return new Date(value); // Convert incoming integer to Date
          }
          throw new Error('GraphQL Date Scalar parser expected a `number`');
        },
        parseLiteral(ast) {
          if (ast.kind === Kind.INT) {
            // Convert hard-coded AST string to integer and then to Date
            return new Date(parseInt(ast.value, 10));
          }
          // Invalid hard-coded value (not an integer)
          return null;
        },
      }),

    Query: {
        // reminders: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleRemindersQuery(parent, args, viewer); },
        reminder: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleReminderQuery(parent, args, viewer); },
    },
    Mutation: {
        createReminder: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleCreateReminderMutation(parent, args, viewer); },
        deleteReminder: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleDeleteReminderMutation(parent, args, viewer); },
    },
};