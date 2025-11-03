import "reflect-metadata";
import { Server } from "./core/server";
import { router } from "./app/routers/auth"

const run = async () => {
    const app = new Server();

    app.registerRouter(router);

    app.start();
};

run();
