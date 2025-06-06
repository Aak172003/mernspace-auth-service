import { Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";

export class AuthController {
    // userService: UserService;
    // constructor(userService: UserService) {
    //     this.userService = userService;
    // }
    // userService: UserService;
    constructor(private userService: UserService) {
        // this.userService = userService;
    }

    async register(req: RegisterUserRequest, res: Response) {
        // We need to tell req.body what kinds of daata you'll receive from frontend
        const { firstName, lastName, email, password } = req.body;

        // If i assess any function which present inside class with creating an instance in controller
        // This make our application highly coupled -> which means without UserService our any controller never work
        // To avoid this highly coupled approach we hav eto do dependecy injection

        // const userService = new UserService();
        // await userService.create({ firstName, lastName, email, password });

        // How we can do just create contructor and revice that instace in its contructor
        await this.userService.create({ firstName, lastName, email, password });
        res.status(201).json();
    }
}
