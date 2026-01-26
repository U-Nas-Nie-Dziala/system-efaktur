import { z } from "zod";

export default z.object({
    firstname: z.string().max(64).nonempty(),
    lastname: z.string().max(64).nonempty(),
    email: z.string().email().max(255).nonempty(),
    password: z.string().min(10).nonempty(),
});
