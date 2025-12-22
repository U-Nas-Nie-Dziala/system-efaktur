import { z } from "zod";

export default z
    .object({
        current_password: z.string().min(10).nonempty(),
        new_password: z.string().min(10).nonempty(),
        confirm_new_password: z.string().min(10).nonempty(),
    })
    .refine((data) => data.new_password === data.confirm_new_password, {
        message: "Passwords must match",
        path: ["confirm_new_password"],
    });
