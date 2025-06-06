import { Repository } from "typeorm";
// import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";

export class UserService {
    constructor(
        // Need to mention this repository for which entity
        private userRepository: Repository<User>,
    ) {}
    async create({ firstName, lastName, email, password }: UserData) {
        // we don't need to create any instance here beacuse we are using dependency injection
        // const userRepository = AppDataSource.getRepository(User);

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
                role: Roles.CUSTOMER,
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
}
