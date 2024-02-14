import {Viewer} from "../../sharedKernel/index.js";

export interface UpdatePushNotificationTokenUseCase {
    execute(viewer: Viewer, pushNotificationToken: string): Promise<Boolean>;
}