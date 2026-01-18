import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Contractor } from "../../models/Contractor";

export type Route = RouteCtx<typeof contract.contractorsCreate>;

export const contractorsCreate = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const contractorsRepository = useRepository<Contractor>(Contractor);

    if (!ctx.req.auth?.token.user.company) {
        return {
            status: 400,
            body: { message: "Brak przypisanej firmy użytkownika." },
        };
    }

    const c = contractorsRepository.create({
        ...ctx.body,
        company: ctx.req.auth?.token.user.company,
    });

    await contractorsRepository.save(c);

    return {
        status: 200,
        body: {},
    };
};
