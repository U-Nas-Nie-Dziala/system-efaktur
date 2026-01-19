import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { KsefSession } from "../../models/KsefSession";
import { TokenRotationService } from "../../core/ksef/services/TokenRotationService";
import { KsefClient } from "../../core/ksef";
import { KsefEnvironment, KsefIdentifierType } from "../../core/ksef/types/api";
import { KsefTokenSecurityService } from "../../services/KsefTokenSecurityService";
import { SocketService } from "../../services/SocketService";

export type Route = RouteCtx<typeof contract.ksefCloseSession>;

export const ksefCloseSession = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const company = ctx.req.auth?.token.user.company;

    if (!company || !company.ksefToken || !company.ksefTokenPassword) {
        return {
            status: 400,
            body: {
                message: "Brak firmy lub dane dostępowe do systemu KSeF nie zostały skonfigurowane.",
            },
        };
    }

    const ksefSessionRepository = useRepository<KsefSession>(KsefSession);

    const session = await ksefSessionRepository.findOneBy({
        status: "OPEN",
        company: {
            id: company.id,
        },
    });

    if (!session) {
        return {
            status: 404,
            body: {
                message: "Brak aktywnej sesji.",
            },
        };
    }

    const ksef = new KsefClient({
        environment: KsefEnvironment.TEST,
        identifierType: KsefIdentifierType.NIP,
        nip: company.nip,
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

    await ksef.closeOnlineSession(accessToken, session.sessionReferenceNumber);
    await ksefSessionRepository.save(ksefSessionRepository.merge(session, { status: "CLOSED" }));

    SocketService.io.to(`user:${ctx.req.auth!.payload.userId}`).emit("ksef:session-close", session.id);

    return {
        status: 200,
        body: {},
    };
};
