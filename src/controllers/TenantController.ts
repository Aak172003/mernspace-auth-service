import { Response, NextFunction } from "express";
import { TenantService } from "../services/TenantService";
import { Logger } from "winston";
import { CreateTenantRequest } from "../types";

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}

    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body;
        this.logger.debug("New request to create a tenant ", { name, address });

        try {
            const tenant = await this.tenantService.create({ name, address });
            this.logger.info("tenant has been created : ", { id: tenant.id });

            this.logger.info("created tenants : ", { tenant: tenant });

            res.status(201).json({ id: tenant.id });
        } catch (err) {
            next(err);
            return;
        }
    }
}
