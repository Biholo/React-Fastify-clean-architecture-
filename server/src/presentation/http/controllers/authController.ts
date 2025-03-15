import { inject, injectable } from "inversify";
import { asyncHandler } from "@/utils/asyncHandler";
import { AuthApplicationUseCase } from "@/application/usecases/authApplicationUseCase";
import { UseCase } from "@/dependencies/constants";
import { AuthenticationError } from "@/domain/errors/authentificationError";
import { Repository } from "@/dependencies/constants";
import { registerSchema, type RegisterSchema, type TokenDto, type LoginSchema, type LogoutSchema, UserDto } from "@domain/dto";
import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticatedRequest } from "@/types/Request";
import { SuccessResponse, errorResponse, successResponse } from "@/types/Reply";
import { AuthUseCase } from "@/domain/usecases/authUseCase";

type RegisterRequest = {
    Body: RegisterSchema;
};

type LoginRequest = {
    Body: LoginSchema;
};

type LogoutRequest = {
    Body: LogoutSchema;
};

@injectable()
export class AuthController {
    constructor(
        @inject(UseCase.AuthUseCase)
        private readonly authUseCase: AuthUseCase
    ) {}

    public register = asyncHandler(async (
        request: FastifyRequest<RegisterRequest>,
        reply: FastifyReply
    ): Promise<void> => {
        const device = {
            name: request.headers["user-agent"] || "unknown",
            ip: request.ip
        };

        console.log(request.body);

        const result = await this.authUseCase.register(request.body, device);

        console.log(result);

        if (result.isErr()) {
            this.handleAuthenticationError(result.unwrapErr(), reply);
            return;
        }

        successResponse<TokenDto>(reply, result.unwrap(), "User registered successfully", 201);
    });

    public login = asyncHandler(async (
        request: FastifyRequest<LoginRequest>,
        reply: FastifyReply
    ): Promise<void> => {
        const device = {
            name: request.headers["user-agent"] || "unknown",   
            ip: request.ip
        };

        const result = await this.authUseCase.login(request.body, device);

        if (result.isErr()) {   
            this.handleAuthenticationError(result.unwrapErr(), reply);
            return;
        }

        successResponse<TokenDto>(reply, result.unwrap(), "Login successful", 200);
    });
    

    public logout = asyncHandler(async (
        request: FastifyRequest<LogoutRequest>,
        reply: FastifyReply
    ): Promise<void> => {
        const result = await this.authUseCase.logout(request.body.token);

        if (result.isErr()) {
            this.handleAuthenticationError(result.unwrapErr(), reply);
            return;
        }

        successResponse(reply, null, "Logout successful", 200);
    });

    public getCurrentUser = asyncHandler(async (
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<void> => {
        const userId = request.user?.id;
        if (!userId) {
            return errorResponse(reply, "Authentication required", 401);
        }

        const result = await this.authUseCase.getCurrentUser(userId);

        if (result.isErr()) {
            this.handleAuthenticationError(result.unwrapErr(), reply);
            return;
        }
        successResponse<UserDto>(reply, result.unwrap(), "User retrieved successfully", 200);
        
    });
    

    private handleAuthenticationError = (
        error: AuthenticationError,
        reply: FastifyReply
      ): FastifyReply => {
        switch (error) {
          case AuthenticationError.EmailAlreadyExists:
          case AuthenticationError.AuthorizationNotFound:
          case AuthenticationError.Unauthorized:
          case AuthenticationError.UserNotFound:
            return errorResponse(reply, "Unauthorized", 401);
          case AuthenticationError.UnsupportedIdentifier:
            return errorResponse(reply, "Unsupported identifier", 400);
          case AuthenticationError.UserCreationFailed:
            return errorResponse(reply, "User creation failed", 500);
          case AuthenticationError.TokenExpired:
            return errorResponse(reply, "Token expired", 401);
          default:
            return errorResponse(reply, "Internal server error", 500);
        }
      };
}

