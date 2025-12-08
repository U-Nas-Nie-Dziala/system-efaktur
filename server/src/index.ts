import "reflect-metadata";
import { Database } from "./core/database";
import { Server } from "./core/server";
import { auth } from "./app/routes/auth";
import { WSS } from "./core/ws";

import { pingEventHandler } from "./app/events/ping";
import { company } from "./app/routes/company";

const run = async () => {
    const app = new Server();

    app.registerRouter(auth);
    app.registerRouter(company);

    await Database.init();
    WSS.start();

    // define WS events
    WSS.defineEventHandler(pingEventHandler);

    app.start();
};

run();
