import { createFastifyApp } from "@/presentation/http/app";
import { FastifyInstance } from "fastify";

export async function createServer() {
  const app = await createFastifyApp();
  return app;
}

