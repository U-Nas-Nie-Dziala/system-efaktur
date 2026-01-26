import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Contractor } from "../../models/Contractor";

export type Route = RouteCtx<typeof contract.contractorsUpdate>;

export const contractorsUpdate = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const contractorsRepository = useRepository<Contractor>(Contractor);

    const c = await contractorsRepository.findOneBy({
        id: ctx.params.id,
        company: {
            user: {
                id: ctx.req.auth?.payload.userId,
            },
        },
    });

    if (!c) {
        return {
            status: 404,
            body: {
                message: "Brak kontrahenta o podanym ID.",
            },
        };
    }

    Object.assign(c, ctx.body);

    await contractorsRepository.save(c);

    return {
        status: 200,
        body: {},
    };
};
