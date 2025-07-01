import { Response, NextFunction, Request } from "express";
import { TenantService } from "../services/TenantService";
import { Logger } from "winston";
import { CreateTenantRequest, TenantQueryParams } from "../types";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}

    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

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

    async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, address } = req.body;
        const tenantId = req.params.tenantId;

        if (isNaN(Number(tenantId))) {
            const error = createHttpError(400, "Invalid url param");
            next(error);
            return;
        }

        this.logger.debug("Request for updating a tenant", req.body);

        try {
            // Wnt to see the updateTenant Data
            const updateTenant = await this.tenantService.update(
                Number(tenantId),
                {
                    name,
                    address,
                },
            );
            this.logger.info("Tenant has been updated", { id: tenantId });
            this.logger.info("update the tennat details : ", updateTenant);

            res.json({ id: Number(tenantId) });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        // This is how we get the query params , this matchedData is used to get the query params from the request which is provided by express-validator
        const validateQuery = matchedData(req, {
            onlyValidData: true,
        });

        console.log("validateQuery :::::::::::: ", validateQuery);

        try {
            const tenants = await this.tenantService.getAll(
                validateQuery as TenantQueryParams,
            );
            this.logger.info("All tenant have been fetched");
            // res.json(tenants);
            res.json({
                currentPage: validateQuery.currentPage as number,
                perPage: validateQuery.perPage as number,
                total: tenants[1],
                data: tenants[0],
            });
        } catch (err) {
            next(err);
            return;
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.tenantId;

        if (isNaN(Number(tenantId))) {
            const error = createHttpError(400, "Invalid url param");
            next(error);
            return;
        }

        try {
            const tenant = await this.tenantService.getById(Number(tenantId));

            if (!tenant) {
                next(createHttpError(400, "Tenant does not exist."));
                return;
            }

            this.logger.info("Tenant has been fetched");
            res.json(tenant);
        } catch (error) {
            next(error);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.tenantId;

        if (isNaN(Number(tenantId))) {
            const error = createHttpError(400, "Invalid url param");
            next(error);
            return;
        }

        try {
            const deletedUser = await this.tenantService.deleteById(
                Number(tenantId),
            );

            this.logger.info("Tenant has been deleted", {
                id: Number(tenantId),
                user: deletedUser,
            });
            res.json({ id: Number(tenantId) });
        } catch (error) {
            next(error);
        }
    }
}
