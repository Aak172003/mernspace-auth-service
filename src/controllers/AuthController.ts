import fs from "fs";
import { NextFunction, Response } from "express";

import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";

import { JwtPayload, sign } from "jsonwebtoken";
// import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import path from "path";
import createHttpError from "http-errors";
import { ConfigVariables } from "../config";
import { RefreshToken } from "../entity/RefreshToken";
import { AppDataSource } from "../config/data-source";

export class AuthController {
    // userService: UserService;
    // constructor(userService: UserService) {
    //     this.userService = userService;
    // }
    // userService: UserService;
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {
        // this.userService = userService;
    }

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        // if (!email) {
        //     const error = createHttpError(400, "email is required");
        //     next(error);
        //     return;
        // }

        // Here we run actual Validation
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        // We need to tell req.body what kinds of daata you'll receive from frontend
        const { firstName, lastName, email, password } = req.body;

        // This is logger
        this.logger.debug("New request to register a user ", {
            firstName,
            lastName,
            email,
            password: "********",
        });
        // If i assess any function which present inside class with creating an instance in controller
        // This make our application highly coupled -> which means without UserService our any controller never work
        // To avoid this highly coupled approach we hav eto do dependecy injection

        // const userService = new UserService();
        // await userService.create({ firstName, lastName, email, password });

        // How we can do just create contructor and revice that instace in its contructor
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });

            this.logger.info("User has been created ", { id: user.id, user });
            let privateKey: Buffer;

            try {
                // Sign the JWT with the private key
                // Read the private key from the file system
                // We can use path.join to make sure that it works on all OS

                privateKey = fs.readFileSync(
                    path.join(__dirname, "../../certs/private.pem"),
                );
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                const error = createHttpError(
                    500,
                    "Error while reading private Key",
                );
                next(error);
                return;
            }

            const payload: JwtPayload = {
                // subject of the token, usually the user ID
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = sign(payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service", // which service signs this token
            });

            // Persist the refresh token in the database
            const refreshTokenRepository =
                AppDataSource.getRepository(RefreshToken);

            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // One Leap Year

            const newRefreshToken = await refreshTokenRepository.save({
                user: user,
                expiresAt: new Date(Date.now() + MS_IN_YEAR),
            });

            console.log("newRefreshToken :::::::::::::::::: ", newRefreshToken);

            const refreshToken = sign(
                payload,
                ConfigVariables.REFRESH_SECRET_KEY!,
                {
                    algorithm: "HS256",
                    expiresIn: "1y",
                    issuer: "auth-service",
                    jwtid: String(newRefreshToken.id), // unique identifier for the refresh token
                },
            );

            res.cookie("accessToken", accessToken, {
                domain: "localhost",

                sameSite: "strict", // security
                maxAge: 1000 * 60 * 60, // 1 hour
                // httpOnly means , this can't access by client side , and only my server can access
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",

                sameSite: "strict", // security
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 Year
                // httpOnly means , this can't access by client side , and only my server can access
                httpOnly: true,
            });

            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}
