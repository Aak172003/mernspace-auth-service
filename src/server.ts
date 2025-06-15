import { ConfigVariables } from "./config";
import app from "./app";
import logger from "./config/logger";
import { AppDataSource } from "./config/data-source";

console.log("Running on Port ------>>>>>> ", ConfigVariables.PORT);

const startServer = async () => {
    const PORT = ConfigVariables.PORT;
    try {
        // Need too create connection with database
        console.log("Database connecting...");
        await AppDataSource.initialize();
        logger.info("Datbase connect Successfully");

        app.listen(PORT, () => {
            logger.info("Server Listening on port", { port: PORT });
            logger.error("We found error ");

            // This logger will not see because i choose info for console transport
            logger.silly("Hi silly logger");
            console.log(`Listening on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
        console.log("error in server.ts file");
        logger.error("Error in server.ts file", { error });
        // Exit process with failure
        process.exit(1);
    }
};

void startServer();
