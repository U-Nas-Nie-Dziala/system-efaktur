import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { User } from "../../models/User";
import * as bcrypt from "bcrypt";

type Route = RouteCtx<typeof contract.changePassword>;

export const changePassword = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const user = useRepository(User);

    const passCheck = await bcrypt.compare(ctx.body.current_password, ctx.req.auth!.token.user.password);

    if (!passCheck) {
        return {
            status: 400,
            body: {
                message: "Obecne hasło jest niepoprawne.",
            },
        };
    }

    ctx.req.auth!.token.user.password = await bcrypt.hash(ctx.body.new_password, 12);

    await user.save(ctx.req.auth!.token.user);

    return {
        status: 200,
        body: {
            message: "Hasło zostało zmienione.",
        },
    };
};
