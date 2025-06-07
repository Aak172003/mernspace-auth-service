// Chaining Method
// import { body } from "express-validator";
// export default body("email").notEmpty().withMessage("Email is Required").isAlpha().withMessage("");

// .notEmpty().withMessage("Email is Required") -> this message if got empty
// isAlpha().withMessage(""); -> this message if get not alpha
// Scema Validation
import { checkSchema } from "express-validator";
export default checkSchema({
    firstName: {
        errorMessage: "First Name is Required",
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: "Last Name is Required",
        notEmpty: true,
        trim: true,
    },
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
        errorMessage: "Password is Required",
        notEmpty: true,
    },
});
