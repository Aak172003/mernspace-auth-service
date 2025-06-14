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
import updateUserValidator from "../validators/update-user-validator";
import { UpdateUserRequest } from "../types";

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

router.patch(
    "/:userId",
    authenticate,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
        await userController.update(req, res, next);
    },
);

router.get("/", (req: Request, res: Response, next: NextFunction) =>
    userController.getAll(req, res, next),
);

router.get(
    "/:userId",
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => userController.getOne(req, res, next),
);

router.delete(
    "/:userId",
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => userController.destroy(req, res, next),
);

export default router;
