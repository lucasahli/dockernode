import {Viewer} from "../../../core/sharedKernel/Viewer.js";
import {graphQlApiPresenter} from "../GraphQlApiPresenter.js";

import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql';

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
        return new Date(value);
    },
    serialize(value) {
        return value.toISOString();
    },
})



export default {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.getTime(); // value sent to the client
        },
        // serialize(value) {
        //     return value.toISOString();
        // },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value);
            }
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