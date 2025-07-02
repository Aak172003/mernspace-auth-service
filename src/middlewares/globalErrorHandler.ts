import { HttpError } from "http-errors";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import logger from "../config/logger";

export const globalErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    const errorId = uuidv4();

    const statusCode = err.status || 500;

    // Here we are checking if the environment is prod or not
    const isProduction = process.env.NODE_ENV === "prod";
    const message = isProduction ? "Internal Server Error" : err.message;

    logger.error(err.message, {
        id: errorId,
        status: statusCode,
        error: err.stack,
        path: req.path,
        method: req.method,
    });

    res.status(statusCode).json({
        error: [
            {
                ref: errorId,
                type: err.name,
                msg: message,
                status: statusCode,
                timestamp: new Date().toISOString(),
                path: req.path,
                method: req.method,
                location: "Server",
                stack: isProduction ? null : err.stack,
            },
        ],
    });
};
