import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import bcrypt from "bcrypt";
import createJWKSMock from "mock-jwks";
import request from "supertest";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";

describe("POST /aut/self", () => {
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
            // Generate a Token
            const accesstoken = jwks.token({
                sub: "1",
                role: Roles.CUSTOMER,
            });
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accesstoken};`])
                .send();

            // Assert
            expect(response.statusCode).toBe(200);
        });

        it("Should return the user data", async () => {
            // Register User -> When we register user to it set accesstoken and refreshToken into cookies , so with my every request it automatically sent (But while perform testing we need to set accesstoken , refreshtoken into cookies )
            // so token ko verify krte time we need to run server as well because we host publick key so publci key ko host krne ke lie server ko run krna pdega
            // But hum ye nhi chahte because it is dependent
            // To avoid this issue we need to create mock server which will create tokens and also host our public key
            // So to create mock server we need to install mock-jwks library this will host our public key in special format like jwks (json web key sets) from .pem file
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // And in this mock server we will follow below steps
            // 1. Generate Token
            // 2. Add token to cookies
            // npm i -D mock-jwks@1.0.10
            // const response = await request(app).get("/auth/self")
            // Assert
            // check if user id matches with registered user

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
                role: Roles.CUSTOMER,
            });

            // Generate a Token
            const accesstoken = jwks.token({
                sub: String(savedUser.id),
                role: savedUser.role,
            });

            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accesstoken};`])
                .send();

            console.log("Response body -------------- ", response.body);
            expect(response.statusCode).toBe(200);
            // Ensure the response contains the user data
            expect((response.body as Record<string, string>).id).toBe(
                savedUser.id,
            );
        });

        it("should not the return password", async () => {
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
                role: Roles.CUSTOMER,
            });

            // Generate a Token
            const accesstoken = jwks.token({
                sub: String(savedUser.id),
                role: savedUser.role,
            });

            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accesstoken};`])
                .send();

            // Ensure the response contains the user data
            expect(response.body).not.toHaveProperty("password");
        });
    });

    // Sad Path -> Basically means (Fields are missing)
    describe("Fields are missing", () => {});
});
