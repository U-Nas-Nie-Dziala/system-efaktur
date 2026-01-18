import { contract, RouteCtx } from "@repo/contract";

type Route = RouteCtx<typeof contract.meInfo>;

export const meInfo = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const user = ctx.req.auth!.token.user;

    return {
        status: 200,
        body: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            hasCompany: user.company ? true : false,
            company: user.company,
        },
    };
};
