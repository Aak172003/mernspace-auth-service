import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/constants";
import app from "../../src/app";
import { User } from "../../src/entity/User";
import { Tenant } from "../../src/entity/Tenant";
import { createTenant } from "../../src/utils";

describe("POST /users", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    // This will execute before all test case execution
    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        try {
            connection = await AppDataSource.initialize();
            console.log(
                "connection ::::::::::::: 1111111111111111111111111111111111111111111111 ",
                connection,
            );
        } catch (err) {
            console.error("Failed to initialize database connection", err);
            throw err; // Fail the test immediately
        }
    });

    // This execute before each test case run
    beforeEach(async () => {
        jwks.start();

        console.log("connection ::::::::::::: ", connection);

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
        it("should persist the user in the database", async () => {
            // So before creating any mangaer first we need to get first tenant from the tenant database
            // Create a dummy tenant

            const tenant = await createTenant(connection.getRepository(Tenant));

            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
                role: Roles.MANAGER,
                tenantId: tenant.id,
            };

            const response = await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send(userData);

            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();

            expect(response.statusCode).toBe(201);
            expect(users).toHaveLength(1);

            // expect(users[0].role).toBe(Roles.MANAGER);
            expect(users[0].email).toBe(userData.email);
        });

        it("should create manager user", async () => {
            const tenant = await createTenant(connection.getRepository(Tenant));

            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "arjun@mern.space",
                password: "secret",
                role: Roles.MANAGER,
                tenantId: tenant.id,
            };
            const response = await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send(userData);

            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();

            expect(response.statusCode).toBe(201);
            expect(users).toHaveLength(1);
            expect(users[0].role).toBe(Roles.MANAGER);
        });
        it.todo("should return 403 if non admin tries to create a user");
    });

    // Sad Path -> Basically means (Fields are missing)
    describe("Fields are missing", () => {});
});
