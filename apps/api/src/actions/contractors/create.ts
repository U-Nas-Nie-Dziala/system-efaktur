import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Contractor } from "../../models/Contractor";

export type Route = RouteCtx<typeof contract.contractorsCreate>;

export const contractorsCreate = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const contractorsRepository = useRepository<Contractor>(Contractor);
    const c = contractorsRepository.create({ ...ctx.body, company: { user: { id: ctx.req.auth?.payload.userId } } });

    await contractorsRepository.save(c);

    return {
        status: 200,
        body: {},
    };
};
