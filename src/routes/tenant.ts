import express, { NextFunction, Response } from "express";
import { TenantController } from "../controllers/TenantController";
import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entity/Tenant";
import { TenantService } from "../services/TenantService";
import logger from "../config/logger";
import { CreateTenantRequest } from "../types";
import authenticate from "../middlewares/authenticate";
import tenantValidator from "../validators/tenant-validator";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);

const tenantService = new TenantService(tenantRepository);

const tenantController = new TenantController(tenantService, logger);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    async (req: CreateTenantRequest, res: Response, next: NextFunction) => {
        await tenantController.create(req, res, next);
    },
);

export default router;
