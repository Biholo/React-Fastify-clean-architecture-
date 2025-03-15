import { AuthenticationError } from "@/domain/errors/authentificationError";
import { LoginSchema, RegisterSchema, TokenSchema, UserSchema } from "@domain/dto/";
import { AsyncResult } from "@/types/AsyncResult";
import { DeviceSchema } from "@/domain/schemas/deviceSchema";

export interface AuthUseCase {
    register(
        credentials: RegisterSchema,
        device: DeviceSchema
    ): AsyncResult<TokenSchema, AuthenticationError>;
    login(
        credentials: LoginSchema,
        device: DeviceSchema
    ): AsyncResult<TokenSchema, AuthenticationError>;
    logout(
        token: string
    ): AsyncResult<null, AuthenticationError>;
    getCurrentUser(
        token: string
    ): AsyncResult<UserSchema, AuthenticationError>;


}

    