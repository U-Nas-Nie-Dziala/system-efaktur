import { RouteCtx, contract } from "@repo/contract";
import { KsefTokenSecurityService } from "../../services/KsefTokenSecurityService";
import { KsefClient } from "../../core/ksef";
import { KsefEnvironment, KsefIdentifierType } from "../../core/ksef/types/api";
import { useRepository } from "../../core/database";
import { KsefSession } from "../../models/KsefSession";
import { SocketService } from "../../services/SocketService";

export type Route = RouteCtx<typeof contract.ksefOpenSession>;

export const ksefOpenSession = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const company = ctx.req.auth?.token.user.company;

    if (!company || !company.ksefToken || !company.ksefTokenPassword) {
        return {
            status: 400,
            body: {
                message: "Brak firmy lub dane dostępowe do systemu KSeF nie zostały skonfigurowane.",
            },
        };
    }

    const isSamePassword = await KsefTokenSecurityService.isSameUserPasswordForToken({
        plain: ctx.body.password,
        password: company.ksefTokenPassword,
    });

    if (!isSamePassword) {
        return {
            status: 403,
            body: {
                message: "Hasło bezpieczeństwa tokenu do systemu KSeF jest niepoprawne.",
            },
        };
    }

    const token = await KsefTokenSecurityService.decryptToken({
        password: ctx.body.password,
        encrypted: company.ksefToken,
    });

    const ksef = new KsefClient({
        environment: KsefEnvironment.TEST,
        identifierType: KsefIdentifierType.NIP,
        nip: company.nip,
        token: token,
    });

    const { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry } = await ksef.authenticateWithToken();
    const { referenceNumber, timestamp, validUntil } = await ksef.openOnlineSession(accessToken);
    const sessionData = ksef.getEncryptionData();

    if (!sessionData) {
        // nie powinno się wydarzyć
        return {
            status: 500,
            body: {
                message: "Wystąpił błąd. Dane sesji nie istnieją.",
            },
        };
    }

    const sessionRepository = useRepository<KsefSession>(KsefSession);

    const s = sessionRepository.create({
        company: company,
        status: "OPEN",
        accessTokenExpiry,
        refreshTokenExpiry,
        sessionReferenceNumber: referenceNumber,
        sessionTimestamp: timestamp,
        sessionValidUntil: validUntil,
        data: await KsefTokenSecurityService.encryptJson(sessionData),
        accessToken: await KsefTokenSecurityService.encrypt(accessToken),
        refreshToken: await KsefTokenSecurityService.encrypt(refreshToken),
    });

    const { id } = await sessionRepository.save(s);

    SocketService.io.to(`user:${ctx.req.auth!.payload.userId}`).emit("ksef:session-open", id);

    return {
        status: 200,
        body: {
            id,
            message: "Dyspozycja otwarcia sesji interaktywnej KSeF została przyjęta.",
        },
    };
};
