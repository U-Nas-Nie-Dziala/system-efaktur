import { z } from "zod";

export default z.object({
    email: z.string().email().max(255).nonempty(),
    password: z.string().min(10).nonempty(),
});
