import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Invoice } from "../../models/Invoice";
import { XmlSerializer } from "../../core/ksef";
import { Faktura } from "../../core/ksef/types";
import { StorageService } from "../../services/StorageService";

export type Route = RouteCtx<typeof contract.invoicesSave>;

export const invoicesSave = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
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

    const serializer = new XmlSerializer();
    const faktura = new Faktura();
    faktura.naglowek.systemInfo = "UNasNieDzialaApp";
    faktura.naglowek.dataWytworzeniaFa = invoice.created_at.toISOString();
    faktura.podmiot1 = invoice.sprzedawca.podmiot1;
    faktura.podmiot2 = invoice.nabywca.podmiot2;
    faktura.fa = invoice.body.fa;

    const XML = serializer.serialize(faktura);

    const result = await StorageService.saveInvoiceOnDisk(invoice.company.id, invoice.id, XML);

    if (!result) {
        return {
            status: 400,
            body: { message: "Nie udało się zapisać faktury." },
        };
    }

    invoice.draft = false;
    await invoicesRepository.save(invoice);

    return {
        status: 200,
        body: {},
    };
};
