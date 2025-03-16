import { z } from "zod";
import type { FastifyRequest, FastifyReply } from "fastify";
import { errorResponse } from "@/types/Reply";
import { logger } from "@/utils/logger";
import { HttpError } from "@/domain/errors/httpError";

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
  querySchema?: z.ZodType<TRequest["Querystring"]>;
  paramsSchema?: z.ZodType<TRequest["Params"]>;
  handler: StrictRequestHandler<TRequest>;
};

type ValidationError = {
  field: string;
  message: string;
  code: string;
};

function formatZodError(error: z.ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
}

export function asyncHandler<TRequest extends RequestType = RequestType>(
  fn: StrictRequestHandler<TRequest> | AsyncHandlerDefinition<TRequest>
): (request: FastifyRequest<TRequest>, reply: FastifyReply) => Promise<void> {
  return async function (request: FastifyRequest<TRequest>, reply: FastifyReply): Promise<void> {
    try {
      if (typeof fn === "function") {
        await fn(request, reply);
        return;
      }

      const { bodySchema, querySchema, paramsSchema, handler } = fn;

      // Validation du body
      if (bodySchema) {
        const body = bodySchema.safeParse(request.body);
        if (!body.success) {
          return errorResponse(
            reply, 
            "Invalid body data", 
            400,
            formatZodError(body.error)
          );
        }
        request.body = body.data as TRequest["Body"];
      }

      // Validation des query
      if (querySchema) {
        const query = querySchema.safeParse(request.query);
        if (!query.success) {
          return errorResponse(
            reply, 
            "Invalid query parameters", 
            400,
            formatZodError(query.error)
          );
        }
        request.query = query.data as TRequest["Querystring"];
      }

      // Validation des params
      if (paramsSchema) {
        const params = paramsSchema.safeParse(request.params);
        if (!params.success) {
          return errorResponse(
            reply, 
            "Invalid route parameters", 
            400,
            formatZodError(params.error)
          );
        }
        request.params = params.data as TRequest["Params"];
      }

      await handler(request, reply);
    } catch (error) {
      logger.error(error);
      
      if (error instanceof HttpError) {
        return errorResponse(reply, error.message, error.statusCode);
      }

      if (error instanceof z.ZodError) {
        return errorResponse(
          reply, 
          "Validation error", 
          400,
          formatZodError(error)
        );
      }

      errorResponse(reply, "Internal server error", 500);
    }
  };
}
