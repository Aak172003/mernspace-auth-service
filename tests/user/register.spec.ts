import request from "supertest";
import app from "../../src/app";

// All Test cases group inside describe
describe("POST /aut/register", () => {
    // Happy Path -> Basically means (Given all fields)
    describe("Given all fields", () => {
        it("Should return 201 status code if i pass all given field ", async () => {
            // AAA ->  Arrange the data , Act on Data , Assert (Check Output)

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
    });

    // Sad Path -> Basically means (Fields are missing)
    describe("Fields are missing", () => {});
});
