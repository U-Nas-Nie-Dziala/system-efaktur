import { Server } from "./core/server";

const run = async () => {
    const app = new Server();

    app.start();
};

run();
