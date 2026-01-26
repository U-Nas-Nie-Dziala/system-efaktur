import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Invoice } from "../../models/Invoice";
import { KsefSession } from "../../models/KsefSession";
import { KsefTokenSecurityService } from "../../services/KsefTokenSecurityService";
import { EncryptionData } from "../../core/ksef/services/CryptographyService";
import { KsefClient } from "../../core/ksef";
import { KsefEnvironment, KsefIdentifierType } from "../../core/ksef/types/api";
import { TokenRotationService } from "../../core/ksef/services/TokenRotationService";

export type Route = RouteCtx<typeof contract.invoicesUpo>;

export const invoicesUpo = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
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

    if (!invoice.referenceNumber) {
        return {
            status: 400,
            body: {
                message: "Faktura nie została przesłana do systemu KSeF.",
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
        const res = await ksef.getInvoiceUPO(invoice.referenceNumber, accessToken, session.sessionReferenceNumber);

        return {
            status: 200,
            body: {
                upo: res.upo,
            },
        };
    } catch (e) {
        console.error(e);

        return {
            status: 400,
            body: {
                message: "Wystąpił błąd podczas pobierania UPO.",
            },
        };
    }
};
