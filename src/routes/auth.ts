import express from "express";
import { AuthController } from "../controllers/AuthController";

const router = express.Router();

const authController = new AuthController();

// Here bindiing issue occurs if we use authcontroller.register directly because this will not refer actual function , bevause here this refer this line context
router.post("/register", async (req, res) => {
    await authController.register(req, res);
});

export default router;
