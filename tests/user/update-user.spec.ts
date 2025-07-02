import createJWKSMock from "mock-jwks";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";

describe("POST /users", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    // This will execute before all test case execution
    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        try {
            connection = await AppDataSource.initialize();
        } catch (err) {
            console.error("Failed to initialize database connection", err);
            throw err; // Fail the test immediately
        }
    });

    // This execute before each test case run
    beforeEach(async () => {
        jwks.start();

        // here we drop the database and synchronize the database manually
        await connection.dropDatabase();
        await connection.synchronize();

        // Database Truncate
        // await truncateTables(connection);
    });

    afterEach(() => {
        jwks.stop();
    });

    // This will execute after all test cases run
    afterAll(async () => {
        if (connection) {
            await connection.destroy();
        }
    });

    // Happy Path -> Basically means (Given all fields)
    describe("Given all fields", () => {
        it.todo("should return 200 if admin tries to update a user");
    });

    // Sad Path -> Basically means (Fields are missing)
    describe("Fields are missing", () => {
        it.todo(
            "should return 400 if admin tries to update a user with missing fields",
        );
    });
});
