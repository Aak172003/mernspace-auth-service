import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
// import { User } from "../../src/entity/User";
import { truncateTables } from "../../src/utils";
import { User } from "../../src/entity/User";

// All Test cases group inside describe
describe("POST /aut/register", () => {
    // Happy Path -> Basically means (Given all fields)
    describe("Given all fields", () => {
        let connection: DataSource;

        // This will execute before all test case execution
        beforeAll(async () => {
            connection = await AppDataSource.initialize();
        });

        // This execute before each test case run
        beforeEach(async () => {
            // Database Truncate

            await truncateTables(connection);
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

        it("Should return 201 status code if i pass all given field ", async () => {
            // AAA -> Arrange the data , Act on Data , Assert (Check Output)

            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // here toBe is a matcher
            expect(response.statusCode).toBe(201);
        });

        it("Should return valid json response", async () => {
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // console.log(
            //     "response.headers ::::::::::::: ",
            //     response.headers["content-type"],
            // );

            // Here we compare
            // expect(
            //     (response.headers as Record<string, string>)["content-type"],
            // ).toEqual(expect.stringContaining("json"));

            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });

        it("should persist the user in database", async () => {
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            console.log(
                "should persist the user in database test",
                response.headers["content-type"],
            );

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            // expect(users).toHaveLength(0);
            expect(users).toHaveLength(1);
            expect(users[0].email).toEqual(userData.email);

            expect(users[0].firstName).toEqual(userData.firstName);

            expect(users[0].lastName).toEqual(userData.lastName);
        });
    });

    // Sad Path -> Basically means (Fields are missing)
    describe("Fields are missing", () => {});
});
