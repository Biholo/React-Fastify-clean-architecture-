import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { logger } from "@/utils/logger";
import chalk from "chalk";

const requestTimings = new Map<string, number>();

const getMethodColor = (method: string) => {
    switch (method) {
        case "GET":
            return chalk.green;
        case "POST":
            return chalk.blue;
        case "PUT":
            return chalk.yellow;
        case "DELETE":
            return chalk.red;
        case "PATCH":
            return chalk.magenta;
        default:
            return chalk.white;
    }
};

const getStatusColor = (statusCode: number) => {
    if (statusCode >= 500) return chalk.red;
    if (statusCode >= 400) return chalk.yellow;
    if (statusCode >= 300) return chalk.blue;
    return chalk.green;
};

export const loggerMiddleware = async (fastify: FastifyInstance) => {
    fastify.addHook("onRequest", (request: FastifyRequest, reply: FastifyReply, done) => {
        const startTime = Date.now();
        const requestId = `${request.method}-${request.url}-${Date.now()}`;
        requestTimings.set(requestId, startTime);

        const methodColor = getMethodColor(request.method);
        logger.info({
            msg: `${methodColor(request.method)} ${request.url}`,
            // method: request.method,
            // url: request.url,
            // headers: request.headers,
            // query: request.query,
            // params: request.params,
            // ip: request.ip,
            // userAgent: request.headers["user-agent"],
            // requestId,
        });
        done();
    });

    fastify.addHook("onResponse", (request: FastifyRequest, reply: FastifyReply, done) => {
        const requestId = `${request.method}-${request.url}-${Date.now()}`;
        const startTime = requestTimings.get(requestId) || Date.now();
        const duration = Date.now() - startTime;
        requestTimings.delete(requestId);

        const statusColor = getStatusColor(reply.statusCode);
        
        logger.info({
            msg: `${statusColor(reply.statusCode)} ${request.method} ${request.url} ${chalk.gray(`${duration}ms`)}`,
            // method: request.method,
            // url: request.url,
            // statusCode: reply.statusCode,
            // duration,
            // responseHeaders: reply.getHeaders(),
            // requestId,
        });
        done();
    });

    fastify.addHook("onError", (request: FastifyRequest, reply: FastifyReply, error: Error, done) => {
        const requestId = `${request.method}-${request.url}-${Date.now()}`;
        const startTime = requestTimings.get(requestId) || Date.now();
        const duration = Date.now() - startTime;
        requestTimings.delete(requestId);

        logger.error({
            msg: `${chalk.red("ERROR")} ${request.method} ${request.url}`,
            method: request.method,
            url: request.url,
            error: {
                message: error.message,
                stack: error.stack,
                code: error.name,
            },
            duration,
            requestId,
        });
        done();
    });
}; 