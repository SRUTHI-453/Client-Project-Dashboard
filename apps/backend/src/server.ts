import "dotenv/config";
import { buildApp } from "./app";
import { initSocket } from "./sockets";

const start = async () => {
  const app = await buildApp();

  try {
    await app.listen({
      port: Number(process.env.PORT) || 4000,
      host: "0.0.0.0",
    });

    initSocket(app.server, app);
    app.log.info("Socket.io initialized");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();