import { FastifyRequest } from "fastify";
import { User } from "@/domain/entities/user";
export interface AuthenticatedRequest extends FastifyRequest {
    user: User;
}

