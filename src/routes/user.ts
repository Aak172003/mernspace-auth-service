import express, { Request, Response, NextFunction } from "express";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
import { UserController } from "../controllers/UserController";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { CredentialService } from "../services/CredentialService";
import { UserService } from "../services/UserService";
import logger from "../config/logger";
import createUserValidator from "../validators/create-user-validator";

const router = express();

const userRepository = AppDataSource.getRepository(User);

const credentialService = new CredentialService();

const userService = new UserService(userRepository, credentialService);

const userController = new UserController(userService, logger);

router.post(
    "/",

    authenticate,
    canAccess([Roles.ADMIN]),
    createUserValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.create(req, res, next);
    },
);

export default router;
