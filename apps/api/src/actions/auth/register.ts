import type { RegisterAccountRequest, RegisterAccountResponse } from "@repo/contract";
import { useRepository } from "../../core/database";
import { User } from "../../models/User";
import * as bcrypt from "bcrypt";

export const registerAccount = async (ctx: RegisterAccountRequest): Promise<RegisterAccountResponse> => {
    const userRepository = useRepository(User);

    const account = await userRepository.findOneBy({
        email: ctx.body.email,
    });

    if (account) {
        return {
            status: 419,
            body: {
                message: "Podany adres e-mail jest zajęty.",
            },
        };
    }

    ctx.body.password = await bcrypt.hash(ctx.body.password, 12);

    await userRepository.save(ctx.body);

    return {
        status: 201,
        body: {},
    };
};
