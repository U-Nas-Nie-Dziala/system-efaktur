import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Company } from "../../models/Company";
import { StorageService } from "../../services/StorageService";

export type Route = RouteCtx<typeof contract.setCompanyData>;

export const setCompanyData = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const companyRepository = useRepository<Company>(Company);

    const company = await companyRepository.findOneBy({
        user: {
            id: ctx.req.auth!.payload.userId,
        },
    });

    if (company) {
        companyRepository.merge(company, ctx.body);
    } else {
        const { id } = await companyRepository.save(companyRepository.create(ctx.body));
        StorageService.initForCompany(id);
    }

    return {
        status: 200,
        body: {},
    };
};
