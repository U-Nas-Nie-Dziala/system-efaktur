import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Company } from "../../models/Company";
import { User } from "../../models/User";
import { StorageService } from "../../services/StorageService";

export type Route = RouteCtx<typeof contract.setCompanyData>;

export const setCompanyData = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const companyRepository = useRepository<Company>(Company);
    const userRepository = useRepository<User>(User);

    const company = await companyRepository.findOneBy({
        user: {
            id: ctx.req.auth!.payload.userId,
        },
    });

    const user = await userRepository.findOneBy({
        id: ctx.req.auth!.payload.userId,
    });

    if (!user) {
        return {
            status: 200,
            body: {},
        };
    }

    if (company) {
        companyRepository.merge(company, ctx.body);
        const savedCompany = await companyRepository.save(company);
        if (!user.company || user.company.id !== savedCompany.id) {
            user.company = savedCompany;
            await userRepository.save(user);
        }
    } else {
        const savedCompany = await companyRepository.save(companyRepository.create(ctx.body));
        user.company = savedCompany;
        await userRepository.save(user);
        StorageService.initForCompany(savedCompany.id);
    }

    return {
        status: 200,
        body: {},
    };
};
