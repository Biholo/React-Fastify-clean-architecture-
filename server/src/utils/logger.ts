import pino from "pino";
import { env } from "@/env";

export const logger = pino({
    level: env.NODE_ENV === "development" ? "debug" : "info",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname,env",
            messageFormat: "{msg}",
            levelFirst: true,
        },
    },
});

export const httpLogger = {
    request: (req: any) => {
        logger.info({
            msg: "Incoming request",
            method: req.method,
            url: req.url,
            headers: req.headers,
            query: req.query,
            params: req.params,
        });
    },
    response: (res: any) => {
        logger.info({
            msg: "Outgoing response",
            statusCode: res.statusCode,
            responseTime: res.getResponseTime(),
        });
    },
    error: (error: Error) => {
        logger.error({
            msg: "Error occurred",
            error: {
                message: error.message,
                stack: error.stack,
            },
        });
    },
}; 