import type { HealthRequest, HealthResponse } from "@repo/contract";

export const health = async (ctx: HealthRequest): Promise<HealthResponse> => {
    return {
        status: 200,
        body: { message: "Healthy" },
    };
};
