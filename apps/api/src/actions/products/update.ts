import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Product } from "../../models/Product";

export type Route = RouteCtx<typeof contract.productsUpdate>;

export const productsUpdate = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const productsRepository = useRepository<Product>(Product);

    const p = await productsRepository.findOneBy({
        id: ctx.params.id,
        company: {
            user: {
                id: ctx.req.auth?.payload.userId,
            },
        },
    });

    if (!p) {
        return {
            status: 404,
            body: {
                message: "Brak towaru/usługi o podanym ID.",
            },
        };
    }

    Object.assign(p, ctx.body);

    await productsRepository.save(p);

    return {
        status: 200,
        body: {},
    };
};
