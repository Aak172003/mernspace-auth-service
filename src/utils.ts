import { DataSource } from "typeorm";
import logger from "./config/logger";

export const calculateDiscount = (price: number, percentage: number) => {
    return price * (percentage / 100);
};

export const truncateTables = async (connection: DataSource) => {
    // connection.entityMetadatas -> provide list of all entites
    const entities = connection.entityMetadatas;
    // Loop over entities
    for (const entity of entities) {
        // this will show repository
        const repository = connection.getRepository(entity.name);
        // clear is like clear all the columns
        await repository.clear();
    }
};

export const isJWT = (token: string | null): boolean => {
    // if we have no token
    if (token === null) {
        return false;
    }
    // split
    const parts = token.split(".");
    if (parts.length !== 3) {
        return false;
    }
    try {
        // As every string is base64 encoded , we just check is every strong is invalid or not
        parts.forEach((part) => {
            Buffer.from(part, "base64").toString("utf-8");
        });
        // If yes then return true otherwise redirect to catch block
        return true;
    } catch (error) {
        logger.error("token can follow the JWT format", error);
        return false;
    }
};
