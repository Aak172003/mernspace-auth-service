import { Repository } from "typeorm";
import { ITenant, TenantQueryParams } from "../types";
import { Tenant } from "../entity/Tenant";

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData);
    }
    async update(id: number, tenantData: ITenant) {
        return await this.tenantRepository.update(id, tenantData);
    }

    async getAll(validateQuery: TenantQueryParams) {
        console.log(
            "validateQuery 222222222222222222222222222222222222 ",
            validateQuery,
        );

        const queryBuilder = this.tenantRepository.createQueryBuilder("tenant");

        console.log("validateQuery :::::::::::::::: ", validateQuery);
        // console.log("queryBuilder :::::::::::::::: ", queryBuilder);

        if (validateQuery.q) {
            const searchTerm = `%${validateQuery.q}%`;

            queryBuilder.where("tenant.name ILIKE :searchTerm", { searchTerm });
        }

        const result = await queryBuilder
            .skip((validateQuery.currentPage - 1) * validateQuery.perPage)
            .take(validateQuery.perPage)
            .orderBy("tenant.id", "DESC")
            .getManyAndCount();

        console.log("queryBuilder :::::::::::::::: ", queryBuilder.getSql());

        console.log("result :::::::::::::::: ", result);

        return result;
    }

    async getById(tenantId: number) {
        return await this.tenantRepository.findOne({ where: { id: tenantId } });
    }

    async deleteById(tenantId: number) {
        return await this.tenantRepository.delete(tenantId);
    }
}
