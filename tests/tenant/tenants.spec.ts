import createJWKSMock from "mock-jwks";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";
import { createTenant } from "../../src/utils";
import { Tenant } from "../../src/entity/Tenant";

describe("GET /tenants", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    // This will execute before all test case execution
    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });

    // This execute before each test case run
    beforeEach(async () => {
        jwks.start();
        // here we
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
        // await connection.destroy();
        if (connection) {
            await connection.destroy();
        } else {
            console.error("Connection is undefined during afterAll");
        }
    });
    // Happy Path -> Basically means (Given all fields)
    describe("Given all fields", () => {
        it("Should return the 200 StatusCode", async () => {
            // Create 10 tenants
            for (let i = 0; i < 10; i++) {
                await createTenant(connection.getRepository(Tenant));
            }

            const response = await request(app).get(
                "/tenants?currentPage=1&perPage=100",
            );

            // Assert
            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveLength(10);
        });
    });

    // Sad Path -> Basically means (Fields are missing)
    describe("Fields are missing", () => {});
});
