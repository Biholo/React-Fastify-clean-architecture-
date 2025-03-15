import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { HttpError } from '@/domain/errors/httpError';
import { verifyToken } from '@/utils/jwt';
import { UserJwtPayload } from '@/domain/entities/user';
import { env } from '@/env';
import { logger } from '@/utils/logger';
// Extension de FastifyRequest pour inclure l'utilisateur
declare module 'fastify' {
  interface FastifyRequest {
    user?: UserJwtPayload;
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new HttpError('Token manquant', 401);
    }

    const result = verifyToken<UserJwtPayload>(token, env.ACCESS_TOKEN_SECRET);
    
    if (result.isErr()) {
      throw new HttpError('Token invalide', 401);
    }

    request.user = result.unwrap();
    return;
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError('Token invalide', 401);
  }
}

// Fonction pour enregistrer le middleware globalement
export function registerAuthMiddleware(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authMiddleware);
}
