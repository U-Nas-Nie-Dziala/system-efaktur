import { z } from "zod";

export default z.object({
    current_password: z.string().min(10).nonempty(),
    new_password: z.string().min(10).nonempty(),
    confirm_new_password: z.string().min(10).nonempty(),
});
