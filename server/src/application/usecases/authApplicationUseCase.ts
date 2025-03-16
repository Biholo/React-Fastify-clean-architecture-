import argon2 from "argon2";
import { inject, injectable } from "inversify";
import { env } from "@/env";
import { Err, Ok, Result } from "@thames/monads";
import { Repository, Service } from "@/dependencies/constants";
import { UserRepository, TokenRepository } from "@/domain/gateway";
import { AsyncResult } from "@/types/AsyncResult";
import { AuthenticationError } from "@/domain/errors/authentificationError";
import { LoginSchema, RegisterSchema, TokenSchema, UserSchema } from "@domain/dto/";
import { AuthService } from "@/domain/services";
import { DeviceSchema } from "@/domain/schemas/deviceSchema";
import { stall } from "@/utils/stall";
import { verifyToken } from "@/utils/jwt";
import { UserJwtPayload } from "@/domain/entities/user";
import { logger } from "@/utils/logger";

@injectable()
export class AuthApplicationUseCase {
    constructor(
        @inject(Repository.UserRepository)
        private readonly userRepository: UserRepository,
        @inject(Repository.TokenRepository)
        private readonly tokenRepository: TokenRepository,
        @inject(Service.AuthService)
        private readonly authService: AuthService
    ) { }

    async register(
        credentials: RegisterSchema,
        device: DeviceSchema
    ): AsyncResult<TokenSchema, AuthenticationError> {
        try {
                    
        const existingUser = await this.userRepository.findByEmail(credentials.email);
        if (existingUser.isSome()) {
            return Err(AuthenticationError.EmailAlreadyExists);
        }

        const hashedPassword = await argon2.hash(credentials.password);

            const newUser = await this.userRepository.create({
                ...credentials,
                password: hashedPassword
            });

            const tokens = await this.authService.generateTokens({
                id: newUser.id,
                email: newUser.email,
                roles: newUser.roles
            }, device);

            return tokens.isOk() ? Ok(tokens.unwrap()) : Err(tokens.unwrapErr());
        } catch (err) {
            logger.error(err instanceof Error ? err.message : "Unknown error");
            return Err(AuthenticationError.UserCreationFailed);
        }
    }

    async login(
        credentials: LoginSchema,
        device: DeviceSchema
    ): AsyncResult<TokenSchema, AuthenticationError> {
        const timeStart = Date.now();
        const stallTime = 1000;

        const existingUser = await this.userRepository.findByEmail(credentials.email);
        if (existingUser.isNone()) {
            return Err(AuthenticationError.InvalidCredentials);
        }

        const user = existingUser.unwrap();

        const isPasswordValid = await argon2.verify(user.password, credentials.password);
        if (!isPasswordValid) {
            return Err(AuthenticationError.InvalidCredentials);
        }   

        const tokens = await this.authService.generateTokens({
            id: user.id,
            email: user.email,
            roles: user.roles
        }, device);

        await stall(stallTime, timeStart);

        return tokens.isOk() ? Ok(tokens.unwrap()) : Err(tokens.unwrapErr());
    }

    async refreshToken(
        refreshToken: string,
        device: DeviceSchema
    ): AsyncResult<TokenSchema, AuthenticationError> {
        const jwtPayloadResult = verifyToken<UserJwtPayload>(
            refreshToken,
            env.REFRESH_TOKEN_SECRET
        );

        if (jwtPayloadResult.isErr()) {
            return Err(AuthenticationError.InvalidRefreshToken);
        }

        const { id, email, roles } = jwtPayloadResult.unwrap();

        const existingToken = await this.tokenRepository.findByToken(refreshToken);
        if (existingToken.isNone()) {
            return Err(AuthenticationError.InvalidRefreshToken);
        }

        const token = existingToken.unwrap();

        if (token.expiresAt < new Date()) {
            return Err(AuthenticationError.ExpiredRefreshToken);
        }

        await this.tokenRepository.delete(token.token);

        const tokens = await this.authService.generateTokens({
            id,
            email,
            roles
        }, device);

        return tokens.isOk() ? Ok(tokens.unwrap()) : Err(tokens.unwrapErr());
    }

    async logout(refreshToken: string): AsyncResult<null, AuthenticationError> {
        await this.tokenRepository.delete(refreshToken);
        return Ok(null);
    }

    async getCurrentUser(userId: string): AsyncResult<UserSchema, AuthenticationError> {
        const user = await this.userRepository.findById(userId);
        if (user.isNone()) {
            return Err(AuthenticationError.UserNotFound);
        }

        const serializedUser = {
            ...user.unwrap(),
            createdAt: user.unwrap().createdAt.toISOString(),
            updatedAt: user.unwrap().updatedAt.toISOString()
        };

        return Ok(serializedUser);
    }
   
}

