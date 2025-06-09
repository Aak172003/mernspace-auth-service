import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";

describe("POST /aut/login", () => {
    let connection: DataSource;

    // This will execute before all test case execution
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    // This execute before each test case run
    beforeEach(async () => {
        // here we
        await connection.dropDatabase();
        await connection.synchronize();

        // Database Truncate
        // await truncateTables(connection);
    });

    // This will execute after all test cases run
    afterAll(async () => {
        // await connection.destroy();
        if (connection) {
            await connection.destroy();
        } else {
            console.error("Connection is undefined during afterAll");
        }
    });
    // Happy Path -> Basically means (Given all fields)
    describe("Given all fields", () => {
        it.todo("Should return 200 StatusCode");
    });

    // Sad Path -> Basically means (Fields are missing)
    describe("Fields are missing", () => {});
});
