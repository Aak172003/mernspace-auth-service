import app from "./src/app";
import { calculateDiscount } from "./src/utils";
import request from "supertest";

describe("App", () => {
    it("should return correct discount amount", () => {
        const discount = calculateDiscount(100, 10);
        // toBe is a matchers
        expect(discount).toBe(10);
    });

    it.todo("Will work in test cases");

    it("should return 200 status code ", async () => {
        const response = await request(app).get("/").send();
        console.log("response ::::::::: ", response);
        expect(response.statusCode).toBe(200);
    });
});
