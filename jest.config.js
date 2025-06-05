/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    /*
    "^.+\\.tsx?$":
    This is a regex pattern that matches all files ending in .ts or .tsx.

    Breakdown:
    ^ — Start of the string
    .+ — One or more characters (filename)
    \\.ts — .ts file extension (escaped dot)
    x? — Optional x (so it matches both .ts and .tsx)
    $ — End of the string
    */

    // becuase of verbose true , test cases will show in proper structured way
    verbose: true,
};
