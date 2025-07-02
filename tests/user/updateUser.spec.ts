import createJWKSMock from "mock-jwks";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import bcrypt from "bcryptjs";
import { Roles } from "../../src/constants";

import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/entity/User";
import { createTenant } from "../../src/utils";
import { Tenant } from "../../src/entity/Tenant";

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
        it("should return 200 if admin tries to update a user", async () => {
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };
            // Create hashed password
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            // Create user repository
            const userRepository = connection.getRepository(User);

            const savedUser = await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.MANAGER,
            });

            // So before creating any mangaer first we need to get first tenant from the tenant database
            // Create a dummy tenant

            const tenant = await createTenant(connection.getRepository(Tenant));

            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            const updateData = {
                firstName: "Priyanshi",
                lastName: "Kumar",
                email: "priyanshi@mern.space",
                password: "secret",
                role: Roles.MANAGER,
                tenantId: tenant.id,
            };

            const response = await request(app)
                .patch(`/users/${savedUser.id}`)
                .set("Cookie", [`accessToken=${adminToken};`])
                .send(updateData);
            expect(response.statusCode).toBe(200);

            expect(response.body.firstName).not.toBe(updateData.firstName);
            expect(response.body.lastName).not.toBe(updateData.lastName);
            expect(response.body.email).not.toBe(updateData.email);
            expect(response.body.role).not.toBe(updateData.role);
            expect(response.body.password).not.toBe(updateData.password);
        });
    });

    // Sad Path -> Basically means (Fields are missing)
    describe("Fields are missing", () => {
        it.todo(
            "should return 400 if admin tries to update a user with missing fields",
        );
    });
});
