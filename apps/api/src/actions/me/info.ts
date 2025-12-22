import { contract, RouteCtx } from "@repo/contract";

type Route = RouteCtx<typeof contract.meInfo>;

export const meInfo = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    return {
        status: 200,
        body: {},
    };
};
