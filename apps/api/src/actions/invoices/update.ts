import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Invoice } from "../../models/Invoice";

export type Route = RouteCtx<typeof contract.invoicesUpdate>;

export const invoicesUpdate = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
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

    if (invoice.draft === false) {
        return {
            status: 400,
            body: {
                message: "Faktura została trwale zapisana. Nie ma możliwości edycji.",
            },
        };
    }

    if (invoice.signed === true) {
        return {
            status: 400,
            body: {
                message: "Faktura została trwale zapisana i podpisana elektronicznie. Nie ma możliwości edycji.",
            },
        };
    }

    invoice.nabywca.podmiot2 = ctx.body.podmiot2 ?? invoice.nabywca.podmiot2;
    invoice.body.fa = ctx.body.fa ?? invoice.body.fa;

    const { id } = await invoicesRepository.save(invoice);

    return {
        status: 200,
        body: {
            id,
        },
    };
};
