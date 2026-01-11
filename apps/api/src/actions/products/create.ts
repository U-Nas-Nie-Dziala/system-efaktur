import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Product } from "../../models/Product";

export type Route = RouteCtx<typeof contract.productsCreate>;

export const productsCreate = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const productsRepository = useRepository<Product>(Product);
    const p = productsRepository.create({ ...ctx.body, company: { user: { id: ctx.req.auth?.payload.userId } } });

    await productsRepository.save(p);

    return {
        status: 200,
        body: {},
    };
};
