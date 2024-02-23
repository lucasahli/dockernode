import {SessionService} from "../components/userSessionContext/application/services/index.js";
import {Viewer} from "./Viewer.js";
import {SessionActivityService} from "../components/userSessionContext/application/services/index.js";

export class SessionUpdater {
    constructor(protected sessionService: SessionService, protected sessionActivityService: SessionActivityService) {
    }

    protected updateUserSession(viewer: Viewer, activityDescription: string, sessionId: string | undefined = undefined): void {
        if(sessionId === undefined){
            sessionId = viewer.getSessionId();
        }
        if (sessionId) {
            this.sessionActivityService.createSessionActivity(viewer, activityDescription, sessionId)
                .then(sessionActivity => {
                this.sessionService.updateSessionActivity(viewer, sessionActivity.id)
                    .then(sessionUpdateWasSuccessful => {
                    if (!sessionUpdateWasSuccessful) {
                        console.log("Session update was NOT successful!!!");
                    } else {
                        console.log(`Session (id: ${sessionId}) updated with: `, sessionActivity.description);
                    }
                }).catch(error => {
                    console.log(`updateSessionActivity failed: ${error}`);
                })
            }).catch(reason => console.log(`Session activity was not created: ${reason}`));
        }
        else {
            console.log(`No sessionId for session update: ${sessionId}`);
        }
    }

}
