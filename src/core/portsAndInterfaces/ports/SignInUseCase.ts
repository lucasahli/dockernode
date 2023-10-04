import {ValidationError, Viewer} from "../../sharedKernel/index.js";
import {Token} from "../../components/reminderContext/domain/valueObjects/Token.js";

export interface SignInUseCase {
    execute(viewer: Viewer, email: string, password: string): Promise<Token | Error>;
}