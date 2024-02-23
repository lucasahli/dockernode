import {GraphQlContext} from "../../../main.js";
import {UpdatePushNotificationTokenUseCase} from "../../../core/portsAndInterfaces/ports/UpdatePushNotificationTokenUseCase.js";
import {
    UpdatePushNotificationTokenUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/UpdatePushNotificationTokenUseCaseHandler.js";
import {
    GetAllDevicesUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/GetAllDevicesUseCaseHandler.js";
import {GetAllDevicesUseCase} from "../../../core/portsAndInterfaces/ports/GetAllDevicesUseCase.js";
import {
    GetDeviceByIdUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/GetDeviceByIdUseCaseHandler.js";
import {GetDeviceByIdUseCase} from "../../../core/portsAndInterfaces/ports/GetDeviceByIdUseCase.js";
import {
    GetSessionsByDeviceIdUseCaseHandler
} from "../../../core/components/userSessionContext/application/useCases/GetSessionsByDeviceIdUseCaseHandler.js";
import {GetSessionsByDeviceIdUseCase} from "../../../core/portsAndInterfaces/ports/GetSessionsByDeviceIdUseCase.js";

export default {
    Query: {
        devices: async (parent: any, args: any, context: GraphQlContext) => {
            const getAllDevicesUseCase: GetAllDevicesUseCase = new GetAllDevicesUseCaseHandler(context.deviceService, context.sessionService, context.sessionActivityService)
            return getAllDevicesUseCase.execute(context.viewer);
        },
        device: async (parent: any, args: any, context: GraphQlContext) => {
            const getDeviceByIdUseCase: GetDeviceByIdUseCase = new GetDeviceByIdUseCaseHandler(context.deviceService, context.sessionService, context.sessionActivityService);
            return getDeviceByIdUseCase.execute(context.viewer, args.id);
        },
    },

    Device: {
        // Sessions By Device
        associatedSessions: async (parent: any, args: any, context: GraphQlContext) => {
            const getSessionsByDeviceIdUseCase: GetSessionsByDeviceIdUseCase = new GetSessionsByDeviceIdUseCaseHandler(context.sessionService, context.sessionActivityService);
            return getSessionsByDeviceIdUseCase.execute(context.viewer, parent.id);
        },
    },

    Mutation: {
        updatePushNotificationToken: async (parent: any, args: any, context: GraphQlContext) => {
            const updatePushNotificationTokenUseCase: UpdatePushNotificationTokenUseCase = new UpdatePushNotificationTokenUseCaseHandler(context.deviceService, context.sessionService, context.sessionActivityService);
            return updatePushNotificationTokenUseCase.execute(context.viewer, args.pushNotificationToken);
        },
    },
};