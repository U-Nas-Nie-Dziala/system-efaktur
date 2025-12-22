import { contract, RouteCtx } from "@repo/contract";
import { AuthenticationService } from "../../core/authentication";

export type Route = RouteCtx<typeof contract.refreshTokens>;

export const refreshTokens = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const refreshTokenPayload = await AuthenticationService.validateToken(ctx.body.refreshToken, "refresh_token");

    if (!refreshTokenPayload) {
        return {
            status: 400,
            body: {
                message: "refresh_token jest błędny.",
            },
        };
    }

    return {
        status: 200,
        body: {
            access_token: "",
            refresh_token: "",
        },
    };
};
