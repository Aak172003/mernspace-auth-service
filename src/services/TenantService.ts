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
        console.log("55555555555555555555555555555555555");
        const queryBuilder = this.tenantRepository.createQueryBuilder("tenant");

        if (validateQuery.q) {
            const searchTerm = `%${validateQuery.q}%`;

            queryBuilder.where("tenant.name ILIKE :searchTerm", { searchTerm });
        }

        console.log("66666666666666666666666666666666666");
        const result = await queryBuilder
            .skip((validateQuery.currentPage - 1) * validateQuery.perPage)
            .take(validateQuery.perPage)
            .orderBy("tenant.id", "DESC")
            .getManyAndCount();

        console.log("77777777777777777777777777777777777", result);
        return result;
    }

    async getById(tenantId: number) {
        return await this.tenantRepository.findOne({ where: { id: tenantId } });
    }

    async deleteById(tenantId: number) {
        return await this.tenantRepository.delete(tenantId);
    }
}
