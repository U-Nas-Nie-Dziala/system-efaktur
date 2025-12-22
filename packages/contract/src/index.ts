import { initContract, ServerInferRequest, ServerInferResponses } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

import registerSchema from "./schemas/registerAccount";
import loginSchema from "./schemas/loginAccount";

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

export type HealthRequest = ServerInferRequest<typeof contract.health>;
export type HealthResponse = ServerInferResponses<typeof contract.health>;
export type RegisterAccountRequest = ServerInferRequest<typeof contract.registerAccount>;
export type RegisterAccountResponse = ServerInferResponses<typeof contract.registerAccount>;
export type LoginAccountRequest = ServerInferRequest<typeof contract.loginAccount>;
export type LoginAccountResponse = ServerInferResponses<typeof contract.loginAccount>;
export type MeInfoRequest = ServerInferRequest<typeof contract.meInfo>;
export type MeInfoResponse = ServerInferResponses<typeof contract.meInfo>;
