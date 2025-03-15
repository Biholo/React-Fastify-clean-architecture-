import { FastifyInstance } from "fastify";
import { authRoutes } from "./authRoutes";

export function registerRoutes(app: FastifyInstance): void {
    app.register(authRoutes, { prefix: "/auth" });
}
