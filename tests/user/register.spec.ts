import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
// import { User } from "../../src/entity/User";
// import { truncateTables } from "../../src/utils";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

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

        it("Should persist the user in database", async () => {
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

        it("Should return an id of created user", async () => {
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

            console.log("response.body :::::::::::: ", response.body);
            expect(response.body).toHaveProperty("id");

            expect(users[0]).toHaveProperty("id");

            // Check here response id and user id in db are same or not
            expect((response.body as Record<string, string>).id).toBe(
                users[0].id,
            );
        });

        it("Should assign a customer role", async () => {
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            console.log("response.body :::::::::::: ", response.body);
            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });

        it("Should stored the hashed password", async () => {
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            console.log("users :::::::::::: ", users);
            console.log(
                "users[0].password ::::::::::::::::::: ",
                users[0].password,
            );
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);

            // Check here this hashd password is really match the wile card pattern
            // this is escape sequence -> \$ -> $
            // any regular expression start and end with /
            // 1. \$2[a|b]\$
            // 2. \d+
            // 3. \$

            expect(users[0].password).toMatch(/^\$2[a|b]\$\d+\$/);
        });
    });

    // Sad Path -> Basically means (Fields are missing)
    describe("Fields are missing", () => {});
});
