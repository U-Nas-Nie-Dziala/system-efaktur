import { initContract, ServerInferRequest, ServerInferResponses } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const contract = c.router({
    health: {
        method: "GET",
        path: "/health",
        responses: {
            200: z.object({ message: z.string() }),
        },
    },
});

export type HealthRequest = ServerInferRequest<typeof contract.health>;
export type HealthResponse = ServerInferResponses<typeof contract.health>;
