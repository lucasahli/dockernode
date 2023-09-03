import {Viewer} from "../../../core/sharedKernel/Viewer.js";
import {graphQlApiPresenter} from "../GraphQlApiPresenter.js";

import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql';


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
        reminders: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleRemindersQuery(parent, args, viewer); },
        reminder: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleReminderQuery(parent, args, viewer); },
    },
    Mutation: {
        createReminder: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleCreateReminderMutation(parent, args, viewer); },
        deleteReminder: async (parent: any, args: any, viewer: Viewer) => { return graphQlApiPresenter.handleDeleteReminderMutation(parent, args, viewer); },
    },
};