import { FastifyReply } from "fastify";

export interface SuccessResponse<T> {
  message: string;
  data: T;
}

export interface ErrorResponse {
  message: string;
  errors?: unknown;
}

export function successResponse<T>(
  reply: FastifyReply,
  data: T,
  message: string = "Success",
  statusCode: number = 200
): FastifyReply {
  return reply.status(statusCode).send({
    message,
    data
  });
}

export function errorResponse(
  reply: FastifyReply,
  message: string,
  statusCode: number = 500,
  errors?: unknown
): FastifyReply {
  const response: ErrorResponse = {
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return reply.status(statusCode).send(response);
}



