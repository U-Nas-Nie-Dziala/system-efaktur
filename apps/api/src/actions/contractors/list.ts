import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Contractor } from "../../models/Contractor";

export type Route = RouteCtx<typeof contract.contractorsList>;

export const contractorsList = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const contractorRepository = useRepository<Contractor>(Contractor);

    const list = await contractorRepository.find({
        where: {
            company: {
                user: {
                    id: ctx.req.auth?.payload.userId,
                },
            },
        },
    });

    return {
        status: 200,
        body: list,
    };
};
