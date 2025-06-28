import { checkSchema } from "express-validator";

export default checkSchema(
    {
        q: {
            trim: true,
            customSanitizer: {
                options: (value: unknown) => {
                    return value ? value : "";
                },
            },
        },
        role: {
            customSanitizer: {
                options: (value: unknown) => {
                    return value ? value : "";
                },
            },
        },
        currentPage: {
            // This is how we define from where we get the current page
            // We can mention like this in: 'query' , but we mention like this so we need to add at every parameter which we get from the query
            in: "query",
            customSanitizer: {
                options: (value) => {
                    const parsedValue = Number(value);
                    // if number is not a number then return 1 , otherwise return the parsed value
                    return Number.isNaN(parsedValue) ? 1 : parsedValue;
                },
            },
        },
        perPage: {
            // This is how we define from where we get the current page
            // We can mention like this in: 'query' , but we mention like this so we need to add at every parameter which we get from the query
            in: "query",
            customSanitizer: {
                options: (value) => {
                    const parsedValue = Number(value);
                    // if number is not a number then return 1 , otherwise return the parsed value
                    return Number.isNaN(parsedValue) ? 4 : parsedValue;
                },
            },
        },
        // to avoid this we mention  like this
    },
    ["query"],
);
