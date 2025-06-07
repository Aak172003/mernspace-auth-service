import express, { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import { CredentialService } from "../services/CredentialService";
// import { body } from "express-validator";
import registerValidator from "../validators/register-validator";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const credentialService = new CredentialService();

// Dependency injection

const userService = new UserService(userRepository, credentialService);

const authController = new AuthController(userService, logger);

// Here bindiing issue occurs if we use authcontroller.register directly because this will not refer actual function , bevause here this refer this line context
router.post(
    "/register",
    // This is a kinf of middleware , which is basically used to valiate the request paramerter
    // body("email").notEmpty(),
    // [body("email").notEmpty(), body("firstName").notEmpty()]

    // After refactoring moved all parameter validators inside seperate file
    registerValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.register(req, res, next);
    },
);

export default router;
