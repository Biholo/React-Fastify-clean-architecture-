import argon2 from "argon2";
import { inject, injectable } from "inversify";
import { env } from "@/env";
import { Err, Ok, Result } from "@thames/monads";
import { Repository } from "@/dependencies/constants";
import { UserRepository, TokenRepository } from "@/domain/gateway";
import { AsyncResult } from "@/types/AsyncResult";  
import { AuthenticationError } from "@/domain/errors/authentificationError";
import { RegisterSchema, TokenSchema } from "@/domain/schemas";
import { generateRefreshToken } from "@/utils/jwt";
import { generateAccessToken } from "@/utils/jwt";
import { DeviceSchema } from "@/domain/schemas/deviceSchema";
import { UserJwtPayload } from "@/domain/entities/user";
import { TokenType } from "@/domain/enum/tokenEnums";
import { CreateToken } from "@/domain/entities/token";
import { logger } from "@/utils/logger";

@injectable()
export class AuthApplicationService {
    constructor(
        @inject(Repository.TokenRepository)
        private readonly tokenRepository: TokenRepository,
    ) {}

    public async generateTokens(
        user: UserJwtPayload,
        device: DeviceSchema = {}
      ): AsyncResult<TokenSchema, AuthenticationError> {
        try {
            const [accessToken, refreshToken] = await Promise.all([
                this.tokenRepository.create({
                    ownedById: user.id,
                    token: generateAccessToken({
                        id: user.id,
                        email: user.email,
                        roles: user.roles,
                    }),
                    type: TokenType.ACCESS_TOKEN,
                    scopes: user.roles.join(","),
                    deviceName: device.name ?? "Unknown Device",
                    deviceIp: device.ip ?? "Unknown IP",
                    expiresAt: new Date(Date.now() + env.ACCESS_TOKEN_EXPIRATION_IN_MS),
                } as CreateToken),
        
                this.tokenRepository.create({
                    ownedById: user.id,
                    token: generateRefreshToken({
                        id: user.id,
                        email: user.email,
                        roles: user.roles,
                    }),
                    type: TokenType.REFRESH_TOKEN,
                    scopes: user.roles.join(","),
                    deviceName: device.name ?? "Unknown Device",
                    deviceIp: device.ip ?? "Unknown IP",
                    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_EXPIRATION_IN_MS),
                } as CreateToken),
            ]);

            return Ok({
                accessToken: accessToken.token,
                refreshToken: refreshToken.token,
            });
        } catch (error) {
            logger.error(error instanceof Error ? error.message : "Unknown error");
            return Err(AuthenticationError.TokenGenerationFailed);
        }
    }
}

