import { z } from "zod";
import type { FastifyRequest, FastifyReply } from "fastify";
import { errorResponse } from "@/types/Reply";
import { logger } from "@/utils/logger";

type RequestType = {
  Body?: unknown;
  Querystring?: unknown;
  Params?: unknown;
  Headers?: unknown;
};

type StrictRequestHandler<TRequest extends RequestType = RequestType> = (
  request: FastifyRequest<TRequest>,
  reply: FastifyReply
) => Promise<void>;

type AsyncHandlerDefinition<TRequest extends RequestType = RequestType> = {
  bodySchema?: z.ZodType<TRequest["Body"]>;
  handler: StrictRequestHandler<TRequest>;
};

export function asyncHandler<TRequest extends RequestType = RequestType>(
  fn: StrictRequestHandler<TRequest> | AsyncHandlerDefinition<TRequest>
): (request: FastifyRequest<TRequest>, reply: FastifyReply) => Promise<void> {
  return async function (request: FastifyRequest<TRequest>, reply: FastifyReply): Promise<void> {
    try {
      if (typeof fn === "function") {
        await fn(request, reply);
        return;
      }

      const { bodySchema, handler } = fn;

      if (bodySchema) {
        const body = bodySchema.safeParse(request.body);

        if (!body.success) {
          errorResponse(reply, "Validation error", 400);
          return;
        }

        request.body = body.data as TRequest["Body"];
      }

      await handler(request, reply);
    } catch (error) {
      logger.error(error);
      errorResponse(reply, "Internal server error", 500);
    }
  };
}
