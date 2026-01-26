import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Company } from "../../models/Company";
import * as bcrypt from "bcrypt";
import { KsefTokenSecurityService } from "../../services/KsefTokenSecurityService";

export type Route = RouteCtx<typeof contract.setKsefToken>;

export const setKsefToken = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const companyRepository = useRepository<Company>(Company);

    const company = await companyRepository.findOneBy({
        user: {
            id: ctx.req.auth!.payload.userId,
        },
    });

    if (!company) {
        return {
            status: 404,
            body: {
                message: "Użytkownik nie posiada firmy. Uzupełnij dane firmy w ustawieniach i spróbuj ponownie.",
            },
        };
    }

    const isSameUserPassword = await KsefTokenSecurityService.isSameUserPasswordForAccount({
        plain: ctx.body.password,
        password: ctx.req.auth!.token.user.password,
    });

    if (isSameUserPassword) {
        return {
            status: 409,
            body: {
                message: "Hasło tokenu KSeF jest takie same jak hasło użytkownika. Hasło musi być inne.",
            },
        };
    }

    company.ksefTokenPassword = await KsefTokenSecurityService.encryptPassword(ctx.body.password);
    company.ksefToken = await KsefTokenSecurityService.encryptToken({
        password: ctx.body.password,
        token: ctx.body.token,
    });

    await companyRepository.save(company);

    return {
        status: 200,
        body: {},
    };
};
