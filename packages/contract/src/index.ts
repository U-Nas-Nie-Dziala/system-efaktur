import { initContract, ServerInferRequest, ServerInferResponses } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

import registerSchema from "./schemas/registerAccount";

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
});

export type HealthRequest = ServerInferRequest<typeof contract.health>;
export type HealthResponse = ServerInferResponses<typeof contract.health>;
export type RegisterAccountRequest = ServerInferRequest<typeof contract.registerAccount>;
export type RegisterAccountResponse = ServerInferResponses<typeof contract.registerAccount>;
