import { AppRoute, initContract, ServerInferRequest, ServerInferResponses, AppRouter } from "@ts-rest/core";
import { Request, Response } from "express";
import { z } from "zod";

const c = initContract();

import registerSchema from "./schemas/registerAccount";
import loginSchema from "./schemas/loginAccount";
import tokensSchema from "./schemas/tokenAccount";

export const contract = c.router({
    health: {
        method: "GET",
        path: "/health",
        responses: {
            200: z.object({ message: z.string() }),
        },
    },
    registerAccount: {
        method: "POST",
        path: "/auth/register",
        body: registerSchema,
        responses: {
            201: z.object({}),
            419: z.object({ message: z.string() }),
        },
    },
    loginAccount: {
        method: "POST",
        path: "/auth/login",
        body: loginSchema,
        responses: {
            200: z.object({
                access_token: z.string(),
                refresh_token: z.string(),
            }),
            400: z.object({
                message: z.string(),
            }),
            404: z.object({
                message: z.string(),
            }),
        },
    },
    refreshTokens: {
        method: "POST",
        path: "/auth/tokens",
        body: tokensSchema,
        responses: {
            200: z.object({
                access_token: z.string(),
                refresh_token: z.string(),
            }),
            400: z.object({
                message: z.string(),
            }),
        },
    },
    meInfo: {
        method: "GET",
        path: "/me/info",
        responses: {},
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
});

export type RouteCtx<T extends AppRoute | AppRouter> = {
    ctx: ServerInferRequest<T> & {
        req: Request;
        res: Response;
    };
    response: ServerInferResponses<T>;
};
