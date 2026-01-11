import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Product } from "../../models/Product";

export type Route = RouteCtx<typeof contract.productsList>;

export const productsList = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const productsRepository = useRepository<Product>(Product);

    const list = await productsRepository.find({
        where: {
            company: {
                user: {
                    id: ctx.req.auth?.payload.userId,
                },
            },
        },
    });

    return {
        status: 200,
        body: list,
    };
};
