import {Viewer} from "../../sharedKernel/index.js";

export interface SignUpUseCase {
    execute(viewer: Viewer, email: string, password: string): Promise<string | null>;
}