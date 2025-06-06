import "reflect-metadata";
import { DataSource } from "typeorm";
import { ConfigVariables } from ".";

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = ConfigVariables;

console.log("DB_HOST :::::::::: ", DB_HOST);
console.log("DB_NAME :::::::::: ", DB_NAME);

console.log("DB_PASSWORD :::::::::: ", DB_PASSWORD);

console.log("DB_PORT :::::::::: ", DB_PORT);
console.log("DB_USERNAME :::::::::: ", DB_USERNAME);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: ConfigVariables.DB_HOST,
    port: 5432,
    username: ConfigVariables.DB_USERNAME,
    password: ConfigVariables.DB_PASSWORD,
    database: ConfigVariables.DB_NAME,
    // This synchronize make sure for developement and testing true ,
    // but not for production case make sure this value is false
    // Don't use this in production
    // synchronize: true,

    // synchronise true sirf dev and test ke time pr rhe to hi better hoga , becasue prod me synchronise true hoga so wo sync me rhega agr mai dev me changes krta hu to wo prod ki entities me refrect krega
    // But hum chahte hai ki , prod me any changes reflect kre tb jb migration execute ho

    // synchronize: NODE_ENV === "test" || NODE_ENV === "dev",
    // now mannually hum synchronise kr rhe hai using connection.synchronise()

    // synchronize: false, // for developemenet because here hum synchronise hi kr rhe hai

    // synchronize:
    //     ConfigVariables.NODE_ENV === "test" ||
    //     ConfigVariables.NODE_ENV === "dev",

    // because manually in all test cases we already syncing with our database ,
    // That's why we make false her
    synchronize: false,
    logging: false,

    // this is wild card pattern . here src/entity/*.ts -> * means any filename with .ts extension from src/entity directory
    entities: ["src/entity/*.{ts,js}"],
    migrations: ["src/migration/*.{ts, js}"],

    subscribers: [],
});
