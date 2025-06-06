import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";

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
            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}
