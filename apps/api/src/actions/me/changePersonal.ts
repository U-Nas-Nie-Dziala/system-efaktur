import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { User } from "../../models/User";

type Route = RouteCtx<typeof contract.changePersonal>;

export const changePersonal = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    ctx.req.auth!.token.user.firstname = ctx.body.firstname;
    ctx.req.auth!.token.user.lastname = ctx.body.lastname;

    const userRepository = useRepository(User);

    await userRepository.save(ctx.req.auth!.token);

    return {
        status: 200,
        body: {
            message: "Dane identyfikacyjne konta zostały zmienione.",
        },
    };
};
