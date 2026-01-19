import { RouteCtx, contract } from "@repo/contract";

export type Route = RouteCtx<typeof contract.health>;

export const health = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    return {
        status: 200,
        body: { message: "Healthy" },
    };
};
