import { AuthenticationError } from "@/domain/errors/authentificationError";
import { env } from "@/env";
import { NonUndefined } from "@/types/NonUndefined";
import { Err, Ok, Result } from "@thames/monads";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UserJwtPayload } from "@/domain/entities/user";
import { logger } from "@/utils/logger";

export function generateAccessToken(payload: UserJwtPayload): string {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRATION_IN_MS,
  });
}

export function generateRefreshToken(payload: UserJwtPayload): string {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRATION_IN_MS,
  });
}

export function verifyToken<T extends NonUndefined>(
  token: string,
  secret: string
): Result<T, AuthenticationError> {
  try {
    const jwtPayload = jwt.verify(token, secret);
    const payload = parseJwtPayload<T>(jwtPayload);
    return Ok(payload);
  } catch (err) {
    logger.error(err);
    const errorType = handleJwtError(err);
    return Err(errorType);
  }
}

function handleJwtError(err: unknown): AuthenticationError {
  if (err instanceof jwt.TokenExpiredError) {
    return AuthenticationError.TokenExpired;
  }

  return AuthenticationError.Unauthorized;
}

function isJwtPayload(payload: JwtPayload | string): payload is JwtPayload {
  return typeof payload === "object";
}

function parseJwtPayload<T>(payload: JwtPayload | string): T {
  if (isJwtPayload(payload)) {
    return payload as T;
  }

  return JSON.parse(payload) as T;
}
