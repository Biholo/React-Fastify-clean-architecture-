import { FastifyInstance } from "fastify";
import { authRoutes } from "@/presentation/http/routes/authRoutes";
import { isHttpError } from "@/domain/errors/httpError";

export async function setupRoutes(app: FastifyInstance): Promise<void> {
  // Préfixe pour toutes les routes API
  app.register(async function apiRoutes(fastify) {
    // Enregistrement des routes
    await registerRoutes(fastify);
  }, { prefix: '/api' });

  // Gestionnaire d'erreurs global
  app.setErrorHandler((error, request, reply) => {
    if (isHttpError(error)) {
      return reply
        .status(error.statusCode)
        .send({ error: error.message });
    }

    return reply
      .status(500)
      .send({ error: "Internal server error" });
  });
}

async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(authRoutes, { prefix: '/auth' });
}