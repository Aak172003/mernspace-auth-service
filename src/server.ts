import { ConfigVariables } from "./config";
import app from "./app";
import logger from "./config/logger";

console.log(ConfigVariables.PORT);

const startServer = () => {
    const PORT = ConfigVariables.PORT;
    try {
        app.listen(PORT, () => {
            logger.info("Server Listening on port", { port: PORT });
            logger.error("We found error ");

            // This logger will not see because i choose info for console transport
            logger.silly("Hi silly logger");
            console.log(`Listening on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

startServer();
