import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

export class Server {
    private express: express.Application;

    constructor() {
        this.express = express();
        this.express.use(helmet);
        this.express.use(
            cors({
                credentials: true,
                preflightContinue: false,
                optionsSuccessStatus: 202,
                origin: "*", // TODO move to config file
                methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            })
        );
        this.express.use(
            rateLimit({
                windowMs: 1000 * 60 * 15,
                limit: 175,
            })
        );

        this.express.use(express.json({ strict: true }));
    }

    public start() {
        this.express.listen(8080);
    }
}
