import { NextFunction, Response } from "express";
import { AuthRequest, RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { JwtPayload } from "jsonwebtoken";
import { validationResult } from "express-validator";
import { TokenService } from "../services/TokenService";
import createHttpError from "http-errors";
import { CredentialService } from "../services/CredentialService";
export class AuthController {
    // userService: UserService;
    // constructor(userService: UserService) {
    //     this.userService = userService;
    // }
    // userService: UserService;
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
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

            const payload: JwtPayload = {
                // subject of the token, usually the user ID
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            // Persist the refresh token in the database
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

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

    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        // We need to tell req.body what kinds of daata you'll receive from frontend
        const { email, password } = req.body;

        // This is logger
        this.logger.debug("New request to login a user ", {
            email,
            password: "********",
        });

        // Check if username (email) is already exists
        // compare password with hashed password
        // generate access token and refresh token
        // set tokens to cookies
        // return the response
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                const error = createHttpError(
                    400,
                    "Email or Password does not match",
                );
                next(error);
                return;
            }

            const isPasswordValid =
                await this.credentialService.comparePassword(
                    password,
                    user.password,
                );
            if (!isPasswordValid) {
                const error = createHttpError(
                    400,
                    "Email or Password does not match",
                );
                next(error);
                return;
            }

            const payload: JwtPayload = {
                // subject of the token, usually the user ID
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);
            // Persist the refresh token in the database
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

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

            this.logger.info("User has been logged in ", { id: user.id, user });
            res.status(200).json({ id: user.id, user });
        } catch (error) {
            next(error);
            return;
        }
    }

    async self(req: AuthRequest, res: Response) {
        console.log("req.user :::::::::::::: ", req.auth);
        const user = await this.userService.findById(Number(req.auth.sub));
        res.json({ ...user, password: undefined });
    }

    async refreshToken(req: AuthRequest, res: Response, next: NextFunction) {
        console.log("req.auth :::::::::::::: ", req.auth);

        // Prepare payload for accessToken
        const payload: JwtPayload = {
            sub: req.auth.sub,
            role: req.auth.role,
        };

        // Call the generateAccessToken method and get the token
        const accessToken = this.tokenService.generateAccessToken(payload);
        // find user , because there is relation between refreshToken and user table
        const user = await this.userService.findById(Number(req.auth.sub));
        // Find user to delete the refreshToken corresponding to it in database
        if (!user) {
            const error = createHttpError(
                401,
                "User with the token couldn't find",
            );
            next(error);
            return;
        }

        // This concept is Token Rotation
        // Persist the refreshToken
        const newRefreshToken =
            await this.tokenService.persistRefreshToken(user);

        // delete the old refreshToken
        await this.tokenService.deleteRefreshToken(Number(req.auth?.id));

        const refreshToken = this.tokenService.generateRefreshToken({
            ...payload,
            id: String(newRefreshToken.id),
        });
        res.cookie("accessToken", accessToken, {
            domain: "localhost",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60, // 1 hour
            // httpOnly means , that can access only by our server not access by client side
            httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, {
            domain: "localhost",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 Year
            httpOnly: true,
        });
        res.json({ id: user.id });
    }
}
