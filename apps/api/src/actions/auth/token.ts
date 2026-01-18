import { contract, RouteCtx } from "@repo/contract";
import { AuthenticationService } from "../../services/AuthenticationService";

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

    const result = await AuthenticationService.refreshTokens(ctx.req.auth!.payload, refreshTokenPayload.payload);

    if (!result) {
        return {
            status: 400,
            body: {
                message: "Nie udało się odświeżyć tokenów.",
            },
        };
    }

    return {
        status: 200,
        body: {
            access_token: result.access_token,
            refresh_token: result.refresh_token,
        },
    };
};
