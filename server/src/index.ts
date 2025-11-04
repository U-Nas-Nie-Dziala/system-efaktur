import "reflect-metadata";
import { Server } from "./core/server";
import { router } from "./app/routers/auth";
import { WSS } from "./core/ws";

import { pingEventHandler } from "./app/events/ping";

const run = async () => {
    const app = new Server();

    app.registerRouter(router);

    WSS.start();

    // define WS events
    WSS.defineEventHandler(pingEventHandler);

    app.start();
};

run();
