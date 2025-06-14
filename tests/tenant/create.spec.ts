import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenant";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/constants";

describe("POST /tenants", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;

    // This will execute before all test case execution
    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");

        connection = await AppDataSource.initialize();
    });

    // This execute before each test case run
    beforeEach(async () => {
        jwks.start();

        // here we drop the database and synchronize the database manually
        await connection.dropDatabase();
        await connection.synchronize();

        // Database Truncate
        // await truncateTables(connection);

        // Generate a Token
        adminToken = jwks.token({
            sub: "1",
            role: Roles.ADMIN,
        });
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
        it("Should return 201 StatusCode", async () => {
            const tenantData = {
                name: "Tenant 1",
                address: "Address 1",
            };

            const response = await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send(tenantData);

            expect(response.statusCode).toBe(201);
        });

        it("should create tenant in the database", async () => {
            const tenantData = {
                name: "Tenant 1",
                address: "Address 1",
            };

            await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send(tenantData);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            // here we check if the tenant is created in the database
            expect(tenants).toHaveLength(1);

            // here we check database create same data as we send in the request
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        });

        it("should return 401 if user is not authenticated", async () => {
            const tenantData = {
                name: "Tenant 1",
                address: "Address 1",
            };

            const response = await request(app)
                .post("/tenants")
                .send(tenantData);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            // here we check if the tenant is created in the database
            expect(tenants).toHaveLength(0);
            expect(response.statusCode).toBe(401);
        });

        // Permission issue

        it("should return 403 if user is not an Admin", async () => {
            // Generate Managaer Token
            const managerToken = jwks.token({
                sub: "1",
                role: Roles.MANAGER,
            });

            const tenantData = {
                name: "Tenant 1",
                address: "Address 1",
            };

            const response = await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${managerToken};`])
                .send(tenantData);

            expect(response.statusCode).toBe(403);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            expect(tenants).toHaveLength(0);
        });
    });

    // Sad Path -> Basically means (Fields are missing)
    describe("Fields are missing", () => {});
});
