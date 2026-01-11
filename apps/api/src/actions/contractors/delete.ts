import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Contractor } from "../../models/Contractor";

export type Route = RouteCtx<typeof contract.contractorsDelete>;

export const contractorsDelete = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const contractorRepository = useRepository<Contractor>(Contractor);

    const c = await contractorRepository.findOneBy({
        id: ctx.params.id,
        company: {
            user: {
                id: ctx.req.auth!.payload.userId,
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

    await contractorRepository.remove(c);

    return {
        status: 200,
        body: {},
    };
};
