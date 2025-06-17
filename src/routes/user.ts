import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
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
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    createUserValidator,
    (async (req: Request, res: Response, next: NextFunction) => {
        await userController.create(req, res, next);
    }) as RequestHandler,
);

router.patch(
    "/:userId",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    (async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
        await userController.update(req, res, next);
    }) as RequestHandler,
);

router.get("/", (async (req: Request, res: Response, next: NextFunction) => {
    await userController.getAll(req, res, next);
}) as RequestHandler);

router.get(
    "/:userId",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (async (req: Request, res: Response, next: NextFunction) => {
        await userController.getOne(req, res, next);
    }) as RequestHandler,
);

router.delete(
    "/:userId",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (async (req: Request, res: Response, next: NextFunction) => {
        await userController.destroy(req, res, next);
    }) as RequestHandler,
);

export default router;
