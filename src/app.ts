//import it somewhere in the global place of your app (for example in app.ts):

import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    express.static("public", {
        dotfiles: "allow", // Allow serving dotfiles (like .htaccess)
    }),
); // Serve static files from the "public" directory

app.use(express.json());
app.use(cookieParser());

// Use next error because if we throw error in asynchronous function so global error handler would n't catch this error
// so to resolve this issue we use next(err)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get("/", (req, res, next) => {
    // const err = createHttpError(401, "You can't access this route");
    // next(err);
    res.send("Welcome to Auth Service");
});

app.use("/auth", authRouter);

// Global Middleware -> which automatically execute whenever we hit any api endpoint
// Global error Handler

// So here Error is an interface which contains only name , message , stack
// But if i want to access statusCode  , so we need to go with the httperrors
// interface Error {
//     name: string;
//     message: string;
//     stack?: string;
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(error.message);
    const statusCode = error.statusCode || error.status || 500;

    res.status(statusCode).json({
        errors: [
            {
                type: error.name,
                msg: error.message,
                path: "",
                location: "",
                statusCode: statusCode,
            },
        ],
    });
});

export default app;
