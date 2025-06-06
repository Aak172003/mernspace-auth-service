import express from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import { CredentialService } from "../services/CredentialService";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const credentialService = new CredentialService();

// Dependency injection

const userService = new UserService(userRepository, credentialService);

const authController = new AuthController(userService, logger);

// Here bindiing issue occurs if we use authcontroller.register directly because this will not refer actual function , bevause here this refer this line context
router.post("/register", async (req, res, next) => {
    await authController.register(req, res, next);
});

export default router;
