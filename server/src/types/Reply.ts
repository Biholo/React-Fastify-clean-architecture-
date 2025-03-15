import { FastifyReply } from "fastify";


export interface SuccessResponse<T> {
  message: string;
  data: T;
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
  statusCode: number = 500
): FastifyReply {
  return reply.status(statusCode).send({
    message
  });
}



