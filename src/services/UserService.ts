import { Brackets, Repository } from "typeorm";
import { User } from "../entity/User";
import { LimitedUserData, UserData, UserQueryParams } from "../types";
import createHttpError from "http-errors";
import { CredentialService } from "./CredentialService";

export class UserService {
    constructor(
        // Need to mention this repository for which entity
        private userRepository: Repository<User>,
        private credentialService: CredentialService,
    ) {}
    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: UserData) {
        // Find any user is already register with the email id or not
        const findUser = await this.userRepository.findOne({
            where: { email: email },
        });
        if (findUser) {
            // Here we use createHttpError because it has one key as well which is statusCode but in normal Error dont have key like statusCode
            // so to get statusCode key we use createHttpError form http-error library
            // interface Error {
            //     name: string;
            //     message: string;
            //     stack?: string;
            // }

            // Also we just we to create an custom error that's why we use

            const error = createHttpError(400, "Email already exist");
            throw error;
        }

        // we don't need to create any instance here beacuse we are using dependency injection
        // const userRepository = AppDataSource.getRepository(User);

        // --------------------------------------------------------------------------------------
        // Always make sure don't add any no. in code this is called magic number ,
        // Always store that no in any variable then use like const saltRounds = 10;
        // --------------------------------------------------------------------------------------
        // const saltRounds = 10;
        const hashedPassword =
            await this.credentialService.giveHashedPassword(password);
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                tenant: tenantId ? { id: tenantId } : undefined,
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            // Here we use createHttpError because it has one key as well which is statusCode but in normal Error dont have key like statusCode
            // so to get statusCode key we use createHttpError form http-error library
            // interface Error {
            //     name: string;
            //     message: string;
            //     stack?: string;
            // }

            // Also we just we to create an custom error that's why we use
            const error = createHttpError(
                500,
                "Failed to store the data in database",
            );

            throw error;
        }
    }

    async findByEmailWithPassword(email: string) {
        // As in user entity we have password column which i make select false so it will not return password
        // so we need to mention explicitly that we need password also
        const user = await this.userRepository.findOne({
            where: { email },
            select: [
                "id",
                "firstName",
                "lastName",
                "email",
                "password",
                "role",
            ],
        });

        return user;
    }

    async findById(user_id: number) {
        const user = await this.userRepository.findOne({
            where: { id: user_id },
            relations: {
                tenant: true,
            },
        });
        return user;
    }

    async update(
        userId: number,
        { firstName, lastName, role, email, tenantId }: LimitedUserData,
    ) {
        try {
            const updatUser = await this.userRepository.update(userId, {
                firstName,
                lastName,
                role,
                email,
                tenant: tenantId ? { id: tenantId } : undefined,
            });

            return updatUser;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            const error = createHttpError(
                500,
                "Failed to update the user in the database",
            );
            throw error;
        }
    }

    // Here implement pagination
    async getAll(validateQuery: UserQueryParams) {
        console.log("validateQuery for user :::::::::::::::: ", validateQuery);

        // user is alias name for user table
        const queryBuilder = this.userRepository.createQueryBuilder("user");

        if (validateQuery.q) {
            const searchTerm = `%${validateQuery.q}%`;
            // Like is case sensitive so we use ILIKE for case insensitive

            // If we use where clause so it make necessary to contain the query in every column
            // But if we use orWhere clause so it will not make necessary to contain the query in every column

            // Brackets is used to add multiple conditions to the query
            // qb is alias name for query builder
            // This is doing column wise search
            queryBuilder.where(
                new Brackets((qb) => {
                    // This is doing row wise search or group wise search
                    qb.where(
                        // CONCAT is used to concatenate the firstName and lastName , ' ' is used to add space between firstName and lastName
                        // ILIKE is used to search the query in a case insensitive manner
                        // user.firstName is used to search the query in the firstName column
                        // user.lastName is used to search the query in the lastName column
                        // q is used to search the query in the q column
                        // searchTerm is used to search the query in the searchTerm column

                        // This process is called binding the value to the query
                        // { q: searchTerm } is used to search the query in the q column
                        "CONCAT(user.firstName, ' ', user.lastName) ILIKE :q",
                        { q: searchTerm },
                    ).orWhere("user.email ILIKE :q", { q: searchTerm });

                    // This is doing column wise search
                    // qb
                    //     .where("user.firstName ILIKE :q", { q: searchTerm })
                    //     .orWhere("user.lastName ILIKE :q", { q: searchTerm })
                    //     .orWhere("user.email ILIKE :q", { q: searchTerm });
                }),
            );

            // .where("user.firstName ILIKE :q", { q: searchTerm })
            // .orWhere("user.lastName ILIKE :q", { q: searchTerm })
            // .orWhere("user.email ILIKE :q", { q: searchTerm });

            // "" OR lastName ILIKE :searchTerm OR email ILIKE :searchTerm", { searchTerm });
        }

        if (validateQuery.role) {
            // andWhere is used to add another condition to the query , but only in single column
            // where is used to add another condition to the query , but in multiple column
            queryBuilder.andWhere("user.role = :role", {
                role: validateQuery.role,
            });
        }

        // For skip -> (1 -1 )*  4  = 0 ( which means skip 0 users because we are fetching data for first page)
        // For take -> 4 ( which means it get 4 users from the database )

        // For skip -> (2 -1 )*  4  = 4 ( which means skip 4 users because we send first four users for current page 1)
        // For take -> 4 ( which means it get 4 users from the database )

        const result = await queryBuilder
            // Second is alias name for tenant table
            .leftJoinAndSelect("user.tenant", "tenant")
            .skip((validateQuery.currentPage - 1) * validateQuery.perPage)
            .take(validateQuery.perPage)
            .orderBy("user.id", "DESC")
            .getManyAndCount();

        console.log("queryBuilder :::::::::::: ", queryBuilder.getSql());
        console.log("result :::::::::::: ", result);
        return result;
    }

    async deleteById(userId: number) {
        return await this.userRepository.delete(userId);
    }
}
