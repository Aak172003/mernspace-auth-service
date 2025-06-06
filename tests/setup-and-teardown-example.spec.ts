// Repeating Setup

// If you have some work you need to do repeatedly for many tests, you can use beforeEach and afterEach hooks.

// The top level before * and after * hooks apply to every test in a file.The hooks declared inside a describe block apply only to the tests within that describe block.
beforeAll(() => console.log("1 - beforeAll"));
afterAll(() => console.log("1 - afterAll"));
beforeEach(() => console.log("1 - beforeEach"));
afterEach(() => console.log("1 - afterEach"));

test("", () => console.log("1 - test"));

describe("Scoped / Nested block", () => {
    beforeAll(() => console.log("2 - beforeAll"));
    afterAll(() => console.log("2 - afterAll"));
    beforeEach(() => console.log("2 - beforeEach"));
    afterEach(() => console.log("2 - afterEach"));

    test("", () => console.log("2 - test"));
});

// Output

// Output

// 1 - beforeAll;
// 1 - beforeEach;
// 1 - test;
// 1 - afterEach;

// Enter into describe block
// 2 - beforeAll;

// Top level berforeEach execute inside all describe block before it's own beforeEach
// And top level afterEach is execute after execute nested describe block afterEach
// And top level afterAll is execute after execute nested describe block afterAll

// 1 - beforeEach;
// 2 - beforeEach;
// 2 - test;
// 2 - afterEach;
// 1 - afterEach;
// 2 - afterAll;
// 1 - afterAll

// ------------------------------------- Order of Execution -------------------------------------------------------------------------------------------------------

// Jest executes all describe handlers in a test file before it executes any of the actual tests.
// This is another reason to do setup and teardown inside before* and after* handlers rather than inside the describe blocks.
// Once the describe blocks are complete, by default Jest runs all the tests serially in the order they were encountered in the collection phase, waiting for each to finish and be tidied up before moving on.

// Consider the following illustrative test file and output:

describe("describe outer", () => {
    console.log("describe outer-a");

    describe("describe inner 1", () => {
        console.log("describe inner 1");

        test("test 1", () => console.log("test 1"));
    });

    console.log("describe outer-b");

    test("test 2", () => console.log("test 2"));

    describe("describe inner 2", () => {
        console.log("describe inner 2");

        test("test 3", () => console.log("test 3"));
    });

    console.log("describe outer-c");
});

// First execute all console inside describe block then execute actual test cases

// describe outer-a
// describe inner 1
// describe outer-b
// describe inner 2
// describe outer-c
// test 1
// test 2
// test 3

beforeEach(() => console.log("connection setup"));
beforeEach(() => console.log("database setup"));

afterEach(() => console.log("database teardown"));
afterEach(() => console.log("connection teardown"));

test("test 1", () => console.log("test 1"));

describe("extra", () => {
    beforeEach(() => console.log("extra database setup"));
    afterEach(() => console.log("extra database teardown"));

    test("test 2", () => console.log("test 2"));
});

// connection setup
// database setup
// test 1
// database teardown
// connection teardown

// Top level berforeEach execute inside all describe block before it's own beforeEach
// And top level afterEach is execute after execute nested describe block afterEach
// And top level afterAll is execute after execute nested describe block afterAll

// connection setup
// database setup
// extra database setup
// test 2
// extra database teardown
// database teardown
// connection teardown
