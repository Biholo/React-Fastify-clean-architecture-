// src/server.ts
import { corsConfig } from '@/infrastructure/config/cors';
import fastify, { FastifyInstance } from 'fastify';
import fastifyFormbody from '@fastify/formbody';
import { registerRoutes } from '@/presentation/http/routes/registerRoutes';
import { loadDependencies } from '@/dependencies/loadDependencies';
import { logger } from '@/utils/logger';
import { loggerMiddleware } from '@/presentation/http/middlewares/loggerMiddleware';

export async function createFastifyApp(): Promise<FastifyInstance> {
    logger.info('Starting Fastify application...');

    const app = fastify({
        logger: false,
    });

    loadDependencies();
    await setupConfig(app);
    await loggerMiddleware(app);
    registerRoutes(app);

    return app;
}

async function setupConfig(app: FastifyInstance): Promise<void> {
    app.register(fastifyFormbody);
    await corsConfig(app);
    app.addHook('onSend', async (request, reply, payload) => {
        reply.header('x-powered-by', '');
        return payload;
    });
}

