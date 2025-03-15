import { AuthApplicationService } from "@/application/services";
import { UserJwtPayload } from "@/domain/entities/user";
import { DeviceSchema } from "@/domain/schemas/deviceSchema";
import { AsyncResult } from "@/types/AsyncResult";
import { TokenSchema } from "@domain/dto/";
import { AuthenticationError } from "../errors/authentificationError";

export interface AuthService {
    generateTokens(
        user: UserJwtPayload,
        device: DeviceSchema
    ): AsyncResult<TokenSchema, AuthenticationError>;
}

    