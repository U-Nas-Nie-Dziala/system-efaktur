import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Product } from "../../models/Product";
import { User } from "../../models/User";

export type Route = RouteCtx<typeof contract.productsCreate>;

export const productsCreate = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    const productsRepository = useRepository<Product>(Product);
    const userRepository = useRepository<User>(User);

    const user = await userRepository.findOne({
        where: { id: ctx.req.auth?.payload.userId },
        relations: { company: true },
    });

    if (!user?.company) {
        return {
            status: 400,
            body: { message: "Brak przypisanej firmy dla użytkownika." },
        };
    }

    const p = productsRepository.create({
        ...ctx.body,
        company: user.company,
    });

    await productsRepository.save(p);

    return {
        status: 200,
        body: {},
    };
};
