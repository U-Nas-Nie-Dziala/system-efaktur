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
import { changePassword } from "./actions/me/changePassword";
import { changePersonal } from "./actions/me/changePersonal";
import { contractorsList } from "./actions/contractors/list";
import { contractorsCreate } from "./actions/contractors/create";
import { contractorsUpdate } from "./actions/contractors/update";
import { contractorsDelete } from "./actions/contractors/delete";
import { productsList } from "./actions/products/list";
import { productsCreate } from "./actions/products/create";
import { productsUpdate } from "./actions/products/update";
import { productsDelete } from "./actions/products/delete";
import { setKsefToken } from "./actions/me/ksefToken";
import { setCompanyData } from "./actions/me/setCompanyData";
import { SocketService } from "./services/SocketService";
import { ksefOpenSession } from "./actions/ksef/openSession";
import { ksefCloseSession } from "./actions/ksef/closeSession";
import { invoicesList } from "./actions/invoices/list";
import { invoicesCreate } from "./actions/invoices/create";
import { invoicesUpdate } from "./actions/invoices/update";
import { invoicesFind } from "./actions/invoices/find";
import { invoicesSave } from "./actions/invoices/save";
import { invoicesDelete } from "./actions/invoices/delete";

const start = async () => {
    Config.validateEnv();

    const router = s.router(contract, {
        health,
        registerAccount,
        loginAccount,
        meInfo,
        refreshTokens,
        changePassword,
        changePersonal,
        contractorsList,
        contractorsCreate,
        contractorsUpdate,
        contractorsDelete,
        productsList,
        productsCreate,
        productsUpdate,
        productsDelete,
        setKsefToken,
        setCompanyData,
        ksefOpenSession,
        ksefCloseSession,
        invoicesList,
        invoicesCreate,
        invoicesUpdate,
        invoicesFind,
        invoicesSave,
        invoicesDelete,
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

    SocketService.initServer();
};
start();
