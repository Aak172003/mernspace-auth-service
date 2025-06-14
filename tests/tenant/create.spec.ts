import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";

describe("POST /tenants", () => {
    let connection: DataSource;

    // This will execute before all test case execution
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    // This execute before each test case run
    beforeEach(async () => {
        // here we drop the database and synchronize the database manually
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
        it("Should return 201 StatusCode", async () => {
            const tenantData = {
                name: "Tenant 1",
                address: "Address 1",
            };
            const response = await request(app)
                .post("/tenants")
                .send(tenantData);

            expect(response.statusCode).toBe(201);
        });
    });

    // Sad Path -> Basically means (Fields are missing)
    describe("Fields are missing", () => {});
});
