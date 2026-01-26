import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Invoice } from "../../models/Invoice";
import { StorageService } from "../../services/StorageService";
import { KsefSession } from "../../models/KsefSession";
import { KsefTokenSecurityService } from "../../services/KsefTokenSecurityService";
import { KsefClient } from "../../core/ksef";
import { KsefEnvironment, KsefIdentifierType } from "../../core/ksef/types/api";
import { TokenRotationService } from "../../core/ksef/services/TokenRotationService";
import { EncryptionData } from "../../core/ksef/services/CryptographyService";

export type Route = RouteCtx<typeof contract.invoicesSend>;

export const invoicesSend = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
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
        relations: {
            company: true,
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

    const xmlInvoice = await StorageService.readInvoiceFromDisk(invoice.company.id, invoice.id);

    if (!xmlInvoice) {
        return {
            status: 400,
            body: {
                message: "Plik XML faktury nie istnieje. Wpierw zapisz fakturę.",
            },
        };
    }

    const ksefSessionRepository = useRepository<KsefSession>(KsefSession);

    const session = await ksefSessionRepository.findOne({
        where: {
            status: "OPEN",
            company: {
                id: invoice.company.id,
            },
        },
    });

    if (!session) {
        return {
            status: 400,
            body: {
                message: "Brak otwartej sesji KSeF. Wpierw otwórz sesję.",
            },
        };
    }

    if (!session.data) {
        return {
            status: 400,
            body: {
                message: "Brak danych sesji.",
            },
        };
    }

    const decryptedData = await KsefTokenSecurityService.decryptJson<EncryptionData>(session.data);
    const ksef = new KsefClient({
        environment: KsefEnvironment.TEST,
        identifierType: KsefIdentifierType.NIP,
        nip: invoice.company.nip,
    });

    if (TokenRotationService.isRefreshNeeded(session.accessValidUntil!)) {
        const refresh = await KsefTokenSecurityService.decrypt(session.refreshToken!);
        const tokens = await ksef.refreshAccessToken(refresh);

        await ksefSessionRepository.save(
            ksefSessionRepository.merge(session, {
                accessValidUntil: tokens.accessValidUntil,
                accessToken: await KsefTokenSecurityService.encrypt(tokens.accessToken),
            })
        );
    }

    const accessToken = await KsefTokenSecurityService.decrypt(session.accessToken!);
    ksef.setEncryptionData({
        cipherKey: Buffer.from(decryptedData.cipherKey),
        cipherIv: Buffer.from(decryptedData.cipherIv),
        encryptedSymmetricKey: decryptedData.encryptedSymmetricKey,
        initializationVector: decryptedData.initializationVector,
    });

    try {
        const res = await ksef.sendInvoice(xmlInvoice, accessToken, session.sessionReferenceNumber);

        invoice.signed = true;
        invoice.sessionReferenceNumber = session.sessionReferenceNumber;
        invoice.referenceNumber = res.referenceNumber;

        await invoicesRepository.save(invoice);
    } catch (e) {
        console.error(e);
        return {
            status: 400,
            body: {
                message: "Wystąpił błąd z wysyłką faktury.",
            },
        };
    }

    return {
        status: 200,
        body: { message: "Healthy" },
    };
};
