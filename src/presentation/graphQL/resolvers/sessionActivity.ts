import {GraphQlContext} from "../../../main.js";
import {
    GetAllSessionActivitiesUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/GetAllSessionActivitiesUseCaseHandler.js";
import {GetAllSessionActivitiesUseCase} from "../../../core/portsAndInterfaces/ports/GetAllSessionActivitiesUseCase.js";
import {
    GetSessionActivityByIdUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/GetSessionActivityByIdUseCaseHandler.js";
import {GetSessionActivityByIdUseCase} from "../../../core/portsAndInterfaces/ports/GetSessionActivityByIdUseCase.js";
import {
    GetSessionBySessionActivityIdUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/GetSessionBySessionActivityIdUseCaseHandler.js";
import {
    GetSessionBySessionActivityIdUseCase
} from "../../../core/portsAndInterfaces/ports/GetSessionBySessionActivityIdUseCase.js";


export default {
    Query: {
        sessionActivities: async (parent: any, args: any, context: GraphQlContext) => {
            const getAllSessionActivitiesUseCase: GetAllSessionActivitiesUseCase = new GetAllSessionActivitiesUseCaseHandler(context.sessionService, context.sessionActivityService)
            return getAllSessionActivitiesUseCase.execute(context.viewer);
        },
        sessionActivity: async (parent: any, args: any, context: GraphQlContext) => {
            const getSessionActivityByIdUseCase: GetSessionActivityByIdUseCase = new GetSessionActivityByIdUseCaseHandler(context.sessionService, context.sessionActivityService);
            return getSessionActivityByIdUseCase.execute(context.viewer, args.id);
        },
    },

    SessionActivity: {
        // Sessions By Device
        associatedSession: async (parent: any, args: any, context: GraphQlContext) => {
            const getSessionBySessionActivityIdUseCase: GetSessionBySessionActivityIdUseCase = new GetSessionBySessionActivityIdUseCaseHandler(context.sessionService, context.sessionActivityService);
            return getSessionBySessionActivityIdUseCase.execute(context.viewer, parent.id);
        },
    },

};