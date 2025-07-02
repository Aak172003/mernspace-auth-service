// Chaining Method
// import { body } from "express-validator";
// export default body("email").notEmpty().withMessage("Email is Required");

// Scema Validation
import { checkSchema } from "express-validator";
import { UpdateUserRequest } from "../types";
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
    role: {
        errorMessage: "Role is required!",
        notEmpty: true,
        trim: true,
    },
    email: {
        isEmail: {
            errorMessage: "Invalid email address!",
        },
        notEmpty: true,
        errorMessage: "Email is required!",
        trim: true,
    },
    tenantId: {
        // notEmpty: true,
        errorMessage: "Tenant id is required!",
        trim: true,
        custom: {
            options: (value: string, { req }) => {
                console.log("value ::::::::::::: ", value);
                const role = (req as UpdateUserRequest).body.role;
                if (role === "admin") {
                    return true;
                } else {
                    return !!value;
                }
            },
        },
    },
});
