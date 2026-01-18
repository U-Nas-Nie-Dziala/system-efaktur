import { contract, RouteCtx } from "@repo/contract";
import { useRepository } from "../../core/database";
import { User } from "../../models/User";
import * as bcrypt from "bcrypt";
import { AuthenticationService } from "../../services/AuthenticationService";

type Route = RouteCtx<typeof contract.loginAccount>;

export const loginAccount = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const userRepository = useRepository(User);

    const account = await userRepository.findOne({
        where: { email: ctx.body.email },
        relations: {
            company: true,
        },
    });

    if (!account) {
        return {
            status: 404,
            body: {
                message: "Konto nie istnieje.",
            },
        };
    }

    const passc = await bcrypt.compare(ctx.body.password, account.password);

    if (!passc) {
        return {
            status: 400,
            body: {
                message: "Wprowadzone hasło jest niepoprawne.",
            },
        };
    }

    const { access_token, refresh_token } = await AuthenticationService.publishTokens({ id: account.id });

    return {
        status: 200,
        body: {
            access_token,
            refresh_token,
        },
    };
};
