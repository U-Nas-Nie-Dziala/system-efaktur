import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Invoice } from "../../models/Invoice";

export type Route = RouteCtx<typeof contract.invoicesCreate>;

export const invoicesCreate = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    if (!ctx.req.auth?.token.user.company) {
        return {
            status: 400,
            body: { message: "Brak przypisanej firmy użytkownika." },
        };
    }

    const invoicesRepository = useRepository<Invoice>(Invoice);

    const i = invoicesRepository.create({
        company: ctx.req.auth.token.user.company,
        draft: true,
        signed: false,
    });

    i.sprzedawca = {
        podmiot1: {
            daneIdentyfikacyjne: {
                nazwa: ctx.req.auth.token.user.company.name,
                nip: ctx.req.auth.token.user.company.nip,
            },
            adres: {
                kodKraju: "PL",
                adresL1: `${ctx.req.auth.token.user.company.street} ${ctx.req.auth.token.user.company.address}`,
                adresL2: `${ctx.req.auth.token.user.company.zipcode} ${ctx.req.auth.token.user.company.city}`,
            },
        },
    };
    i.nabywca = {
        podmiot2: ctx.body.podmiot2,
    };
    i.body = {
        fa: ctx.body.fa,
    };

    const { id } = await invoicesRepository.save(i);

    return {
        status: 200,
        body: {
            id,
        },
    };
};
