import {GraphQlContext} from "../../../main.js";
import {GetAllSessionsUseCase} from "../../../core/portsAndInterfaces/ports/GetAllSessionsUseCase.js";
import {
    GetAllSessionsUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/GetAllSessionsUseCaseHandler.js";
import {
    GetSessionByIdUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/GetSessionByIdUseCaseHandler.js";
import {GetSessionByIdUseCase} from "../../../core/portsAndInterfaces/ports/GetSessionByIdUseCase.js";
import {
    GetSessionActivitiesBySessionIdUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/GetSessionActivitiesBySessionIdUseCaseHandler.js";
import {
    GetSessionActivitiesBySessionIdUseCase
} from "../../../core/portsAndInterfaces/ports/GetSessionActivitiesBySessionIdUseCase.js";
import {
    GetDeviceBySessionIdUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/GetDeviceBySessionIdUseCaseHandler.js";
import {GetDeviceBySessionIdUseCase} from "../../../core/portsAndInterfaces/ports/GetDeviceBySessionIdUseCase.js";
import {
    GetLoginBySessionIdUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/GetLoginBySessionIdUseCaseHandler.js";
import {GetLoginBySessionIdUseCase} from "../../../core/portsAndInterfaces/ports/GetLoginBySessionIdUseCase.js";

export default {
    Query: {
        sessions: async (parent: any, args: any, context: GraphQlContext) => {
            const getAllSessionsUseCase: GetAllSessionsUseCase = new GetAllSessionsUseCaseHandler(context.sessionService, context.sessionActivityService)
            return getAllSessionsUseCase.execute(context.viewer);
        },
        session: async (parent: any, args: any, context: GraphQlContext) => {
            const getSessionByIdUseCase: GetSessionByIdUseCase = new GetSessionByIdUseCaseHandler(context.sessionService, context.sessionActivityService);
            return getSessionByIdUseCase.execute(context.viewer, args.id);
        },
    },

    Session: {
        // SessionActivities By Session
        associatedSessionActivities: async (parent: any, args: any, context: GraphQlContext) => {
            const getSessionActivitiesBySessionIdUseCase: GetSessionActivitiesBySessionIdUseCase = new GetSessionActivitiesBySessionIdUseCaseHandler(context.sessionService, context.sessionActivityService);
            return getSessionActivitiesBySessionIdUseCase.execute(context.viewer, parent.id);
        },
        associatedDevice: async (parent: any, args: any, context: GraphQlContext) => {
            const getDeviceBySessionIdUseCase: GetDeviceBySessionIdUseCase = new GetDeviceBySessionIdUseCaseHandler(context.deviceService, context.sessionService, context.sessionActivityService);
            return getDeviceBySessionIdUseCase.execute(context.viewer, parent.id);
        },
        associatedLogin: async (parent: any, args: any, context: GraphQlContext) => {
            const getLoginByIdUseCase: GetLoginBySessionIdUseCase = new GetLoginBySessionIdUseCaseHandler(context.loginService, context.sessionService, context.sessionActivityService);
            return getLoginByIdUseCase.execute(context.viewer, parent.id);
        },
        associatedRefreshToken: async (parent: any, args: any, context: GraphQlContext) => {
            return null;
        },
    },

};