// This is the centralised location
// here we read all environment varibles and export them

// This is one way to read all variables from .env files
import { config } from "dotenv";
config();

const { PORT, NODE_ENV } = process.env;

export const ConfigVariables = {
    PORT,
    NODE_ENV,
};
