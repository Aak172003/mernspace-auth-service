import { NextFunction, Response } from "express";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { CreateUserRequest } from "../types";
import { Roles } from "../constants";
import { validationResult } from "express-validator";

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);

        console.log(
            "this is result from create user ============ ",
            result.array(),
        );

        console.log("0000000000000000000000000000000000000000");
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password } = req.body;
        console.log("------------------------------------------");
        this.logger.debug("New request to create a user ", {
            firstName,
            lastName,
            email,
            password: "********",
        });

        try {
            console.log("111111111111111111111111");
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.MANAGER,
            });

            console.log("22222222222222222222222222222");
            console.log("this is user from laptop ------------ ", user);

            res.status(201).json({ id: user.id });
        } catch (error) {
            this.logger.error(error);
            next(error);
        }
    }
}
