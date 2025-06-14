import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { isJWT } from "../../src/utils";
import { RefreshToken } from "../../src/entity/RefreshToken";

// All Test cases group inside describe
describe("POST /aut/register", () => {
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

            await request(app).post("/auth/register").send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            // Assert
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

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

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

            await request(app).post("/auth/register").send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
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
            // const users = await userRepository.find();

            // const users = await userRepository.find();

            // explicitely i mention that i need only password
            const users = await userRepository.find({ select: ["password"] });

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

        it("Should return 400 status code if given email is already exist", async () => {
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };

            // Assert
            const userRepository = connection.getRepository(User);
            // Save a user in database
            await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            const users = await userRepository.find();
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });

        // ---------------------------------------- JWT Token TestCases -------------------------------------------

        it("Should return the acess token and refresh token inside a cookie ", async () => {
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
            let accessToken = null;
            let refreshToken = null;

            const cookies = response.headers["set-cookie"] || [];
            // console.log("cookies ::::::::::::::::::: ", cookies);
            for (const cookie of cookies) {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0].split("=")[1];
                }
                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0].split("=")[1];
                }
            }
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            // This check is this token is in jwt format or not
            expect(isJWT(accessToken)).toBeTruthy();
            expect(isJWT(refreshToken)).toBeTruthy();
        });

        it("Should store the refresh token in the database", async () => {
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            const refreshTokenRepo = connection.getRepository(RefreshToken);
            const refreshTokens = await refreshTokenRepo.find();

            // we just check refreshtoken.userid is exist in user table or not , as response retur user id so we can check that
            // here i check explicitely that
            const tokens = await refreshTokenRepo
                .createQueryBuilder("refreshToken")
                .where("refreshToken.userId = :userId", {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany();
            expect(refreshTokens).toHaveLength(1);

            expect(tokens).toHaveLength(1);
        });
    });

    // Sad Path -> Basically means (Fields are missing)
    describe("Fields are missing", () => {
        it("Should reture 400 status code  if email field is missing", async () => {
            const userData = {
                firstName: "",
                lastName: "K",
                email: "",
                password: "secret",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            const userRepository = connection.getRepository(User);
            // This return list of user
            const users = await userRepository.find();
            // Assert
            expect(response.statusCode).toBe(400);
            // Here make sure , if email is not revecive so no new user create in db
            expect(users).toHaveLength(0);
        });

        // Pending Test Case
        it.todo("Should reture 400 status code  if firstName field is missing");
        it.todo("Should reture 400 status code  if lastName field is missing");
        it.todo("Should reture 400 status code  if password field is missing");
    });

    describe("Fields are not in proper format", () => {
        it("Should trim the email field ", async () => {
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "          rakesh@mern.space          ",
                password: "secret",
            };

            // Assert
            await request(app).post("/auth/register").send(userData);

            // Assert
            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();

            // Assert
            const trimEmail = userData.email.trim();
            expect(users[0].email).toBe(trimEmail);
        });

        // Pending Test Case
        it.todo("Should return 400 status code if email is not as valid email");
        test.todo(
            "Should return 400 status code if password length is less than 8 characters",
        );
        it.todo(
            "Should return message (Password is too short) if password length < 8 ",
        );
        it.todo(
            "Should return message (Password is too long) if password length greater than 10 ",
        );
    });
});
