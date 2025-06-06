import { Repository } from "typeorm";
// import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { UserData } from "../types";

export class UserService {
    constructor(
        // Need to mention this repository for which entity
        private userRepository: Repository<User>,
    ) {}
    async create({ firstName, lastName, email, password }: UserData) {
        // we don't need to create any instance here beacuse we are using dependency injection
        // const userRepository = AppDataSource.getRepository(User);

        await this.userRepository.save({
            firstName,
            lastName,
            email,
            password,
        });
    }
}
