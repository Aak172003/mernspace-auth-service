import { checkSchema } from "express-validator";
export default checkSchema({
    email: {
        errorMessage: "Email is always Required",
        notEmpty: true,
        trim: true,
        // Built-in function to check is valid email or not
        isEmail: {
            errorMessage: "Email should be a valid email",
        },
    },
    password: {
        trim: true,
        errorMessage: "Password is Required",
        notEmpty: true,
    },
});
