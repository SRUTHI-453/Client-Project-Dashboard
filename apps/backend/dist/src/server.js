"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const sockets_1 = require("./sockets");
const start = async () => {
    const app = await (0, app_1.buildApp)();
    try {
        await app.listen({
            port: Number(process.env.PORT) || 4000,
            host: "0.0.0.0",
        });
        (0, sockets_1.initSocket)(app.server, app);
        app.log.info("Socket.io initialized");
    }
    catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};
start();
