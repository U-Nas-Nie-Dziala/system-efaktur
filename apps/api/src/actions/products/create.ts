import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Product } from "../../models/Product";

export type Route = RouteCtx<typeof contract.productsCreate>;

export const productsCreate = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const productsRepository = useRepository<Product>(Product);

    if (!ctx.req.auth?.token.user.company) {
        return {
            status: 400,
            body: { message: "Brak przypisanej firmy użytkownika." },
        };
    }

    const p = productsRepository.create({
        ...ctx.body,
        company: ctx.req.auth?.token.user.company,
    });

    await productsRepository.save(p);

    return {
        status: 200,
        body: {},
    };
};
