import "reflect-metadata";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import express from "express";
import { contract } from "@repo/contract";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const s = initServer();

import { health } from "./actions/health";
import { registerAccount } from "./actions/auth/register";
import { loginAccount } from "./actions/auth/login";

const router = s.router(contract, {
    health,
    registerAccount,
    loginAccount,
});

createExpressEndpoints(contract, router, app, {});

app.listen(3000, () => {
    //
});
