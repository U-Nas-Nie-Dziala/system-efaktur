import "reflect-metadata";
import { Server } from "./core/server";
import { router } from "./app/routers/auth"
import { WSS } from "./core/ws";

const run = async () => {
    const app = new Server();
    
    app.registerRouter(router);
    
    WSS.start()
    app.start();
};

run();