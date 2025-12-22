import "reflect-metadata";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import express from "express";
import { contract } from "@repo/contract";
import { Config } from "./core/config";
import { authMiddleware } from "./core/authentication";
import { Database } from "./core/database";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet());
app.use(
    cors({
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 202,
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const s = initServer();

import { health } from "./actions/health";
import { registerAccount } from "./actions/auth/register";
import { loginAccount } from "./actions/auth/login";
import { refreshTokens } from "./actions/auth/token";
import { meInfo } from "./actions/me/info";

const start = async () => {
    Config.validateEnv();

    const router = s.router(contract, {
        health,
        registerAccount,
        loginAccount,
        meInfo,
        refreshTokens,
    });

    createExpressEndpoints(contract, router, app, {
        globalMiddleware: [
            async (req, res, next) => {
                const meta = (req.tsRestRoute as any).metadata as { auth: true };

                if (!meta) {
                    return next();
                }

                return await authMiddleware(req as express.Request, res, next);
            },
        ],
    });

    await Database.init();

    const PORT = Config.key<string>("APP_PORT");

    app.listen(PORT, () => {
        console.info(`Server running at: http://localhost:${PORT}`);
    });
};
start();
