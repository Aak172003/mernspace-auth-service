import { ConfigVariables } from "./config";
import app from "./app";

console.log(ConfigVariables.PORT);

const startServer = () => {
    const PORT = ConfigVariables.PORT;
    try {
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

startServer();
