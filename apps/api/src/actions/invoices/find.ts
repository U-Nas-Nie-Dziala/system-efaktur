import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Invoice } from "../../models/Invoice";

export type Route = RouteCtx<typeof contract.invoicesFind>;

export const invoicesFind = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    if (!ctx.req.auth?.token.user.company) {
        return {
            status: 400,
            body: { message: "Brak przypisanej firmy użytkownika." },
        };
    }

    const invoicesRepository = useRepository<Invoice>(Invoice);

    const invoice = await invoicesRepository.findOne({
        where: {
            id: ctx.params.id,
            company: {
                user: {
                    id: ctx.req.auth.payload.userId,
                },
            },
        },
    });

    if (!invoice) {
        return {
            status: 404,
            body: {
                message: "Faktura o podanym ID nie istnieje.",
            },
        };
    }

    return {
        status: 200,
        body: invoice,
    };
};
