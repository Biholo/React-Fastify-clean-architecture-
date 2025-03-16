import { createFastifyApp } from "@/presentation/http/app";
import { FastifyInstance } from "fastify";
import { logger } from "@/utils/logger";
import { env } from "@/env";


export async function createServer() {
  const app = await createFastifyApp();
  // logger.info(`Database URL: ${env.DATABASE_URL}`);
  return app;
}

