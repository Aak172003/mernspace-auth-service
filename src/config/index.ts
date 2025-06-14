// This is the centralised location
// here we read all environment varibles and export them

// This is one way to read all variables from .env files
import { config } from "dotenv";
import path from "path";

config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV ?? "dev"}`),
});

const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    REFRESH_SECRET_KEY,
    ACCESS_EXPIRATION_TIME,
    REFRESH_EXPIRATION_TIME,
    JWKS_URI,
    PRIVATE_KEY,
} = process.env;

export const ConfigVariables = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    REFRESH_SECRET_KEY,
    ACCESS_EXPIRATION_TIME,
    REFRESH_EXPIRATION_TIME,
    JWKS_URI,
    PRIVATE_KEY,
};
