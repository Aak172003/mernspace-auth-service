import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { CredentialService } from "./CredentialService";

export class UserService {
    constructor(
        // Need to mention this repository for which entity
        private userRepository: Repository<User>,
        private credentialService: CredentialService,
    ) {}
    async create({ firstName, lastName, email, password, role }: UserData) {
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

    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
        });

        return user;
    }
    async findById(user_id: number) {
        const user = await this.userRepository.findOne({
            where: { id: user_id },
        });
        return user;
    }
}
