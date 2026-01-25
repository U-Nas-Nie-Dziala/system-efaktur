import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Invoice } from "../../models/Invoice";

export type Route = RouteCtx<typeof contract.invoicesList>;

export const invoicesList = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const invoicesRepository = useRepository<Invoice>(Invoice);

    const list = await invoicesRepository.find({
        where: {
            company: {
                user: {
                    id: ctx.req.auth!.payload.userId,
                },
            },
        },
    });

    return {
        status: 200,
        body: list,
    };
};
