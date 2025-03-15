import { ApplicationError } from "@/domain/errors/applicationError";

export class HttpError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
  }

  public static badRequest(message: string): HttpError {
    return new HttpError(message, 400);
  }

  public static unauthorized(message: string): HttpError {
    return new HttpError(message, 401);
  }

  public static forbidden(message: string): HttpError {
    return new HttpError(message, 403);
  }

  public static notFound(message: string): HttpError {
    return new HttpError(message, 404);
  }

  public static internalServerError(message: string): HttpError {
    return new HttpError(message, 500);
  }

  public static fromError(error: Error, statusCode: number): HttpError {
    return new HttpError(error.message, statusCode);
  }

  public static fromUnknownError(statusCode: number): HttpError {
    return new HttpError("An unknown error occurred", statusCode);
  }

  public static fromApplicationError(error: ApplicationError): HttpError {
    return new HttpError(error, 500);
  }

  public static fromValidationError(errors: string[]): HttpError {
    return new HttpError(errors.join(", "), 400);
  }
}

export function isHttpError(err: unknown): err is HttpError {
  return err instanceof HttpError;
}
