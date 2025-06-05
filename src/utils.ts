import { DataSource } from "typeorm";

export const calculateDiscount = (price: number, percentage: number) => {
    return price * (percentage / 100);
};

export const truncateTables = async (connection: DataSource) => {
    // connection.entityMetadatas -> provide list of all entites
    const entities = connection.entityMetadatas;

    console.log("entities :::::::: ", entities);

    // Loop over entities
    for (const entity of entities) {
        // this will show repositery
        const repositery = connection.getRepository(entity.name);

        console.log("repositery ::::::::::: ", repositery);
        // clear is like clear all the columns
        await repositery.clear();
    }
};
