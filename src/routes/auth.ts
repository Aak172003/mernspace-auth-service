import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import { CredentialService } from "../services/CredentialService";
import registerValidator from "../validators/register-validator";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
import loginValidator from "../validators/login-validator";
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../types";
import validateRefreshToken from "../middlewares/validateRefreshToken";
import parseRefreshToken from "../middlewares/parseRefreshToken";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const credentialService = new CredentialService();

const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

const tokenService = new TokenService(refreshTokenRepository);

// Dependency injection

const userService = new UserService(userRepository, credentialService);

const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
);

// Here bindiing issue occurs if we use authcontroller.register directly because this will not refer actual function , bevause here this refer this line context
router.post(
    "/register",
    // This is a kinf of middleware , which is basically used to valiate the request paramerter
    // body("email").notEmpty(),
    // [body("email").notEmpty(), body("firstName").notEmpty()]

    // After refactoring moved all parameter validators inside seperate file
    registerValidator,
    (async (req: Request, res: Response, next: NextFunction) => {
        await authController.register(req, res, next);
    }) as RequestHandler,
);

router.post(
    "/login",
    // This is a kinf of middleware , which is basically used to valiate the request paramerter
    // body("email").notEmpty(),
    // [body("email").notEmpty(), body("firstName").notEmpty()]

    // After refactoring moved all parameter validators inside seperate file
    loginValidator,
    (async (req: Request, res: Response, next: NextFunction) => {
        await authController.login(req, res, next);
    }) as RequestHandler,
);

// This is protected route , so we need to authenticate the user before accessing this route
router.get(
    "/self",
    authenticate as RequestHandler,
    (async (req: Request, res: Response) => {
        await authController.self(req as AuthRequest, res);
    }) as RequestHandler,
);

router.post(
    "/refresh",
    validateRefreshToken as RequestHandler,
    (async (req: Request, res: Response, next: NextFunction) => {
        await authController.refreshToken(req as AuthRequest, res, next);
    }) as RequestHandler,
);

router.post(
    "/logout",
    authenticate as RequestHandler,
    parseRefreshToken,
    (async (req: Request, res: Response, next: NextFunction) => {
        await authController.logout(req as AuthRequest, res, next);
    }) as RequestHandler,
);

export default router;
