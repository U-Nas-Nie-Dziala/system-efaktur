import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import cors from "cors";
// import multer from "multer";
import { Config } from "./config";

export class Server {
    private express: express.Application;

    constructor() {
        Config.validateEnv();

        this.express = express();
        this.express.use(helmet());
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

        this.express.use(cookieParser(Config.key<string>("APP_COOKIE_SECRET")));

        this.express.use(express.json({ strict: true }));

        // this.express.use(multer)
    }

    public registerRouter(router: express.Router)
    {
        this.express.use(router);
    }

    public start() {
        this.express.listen(Config.key<number>("APP_PORT"), () =>
            console.log(
                `Server running at: http://localhost:${Config.key<number>(
                    "APP_PORT"
                )}`
            )
        );
    }
}
