import {Viewer} from "../../sharedKernel/index.js";

export interface SignInUseCase {
    execute(viewer: Viewer, email: string, password: string): Promise<string | null>;
}